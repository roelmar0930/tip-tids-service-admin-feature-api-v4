const mongoose = require('mongoose');
const config = require('../config/config');
const TeamMemberTask = require('../models/TeamMemberTask');
const TeamMember = require('../models/TeamMember');

async function updateTeamMemberWorkdayId() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get all team members
    const teamMembers = await TeamMember.find({});
    if (teamMembers.length === 0) {
      console.error('No team members found');
      process.exit(1);
    }

    // Update TeamMemberTask entries with missing workdayId
    const updatedTasks = await TeamMemberTask.updateMany(
      { teamMemberWorkdayId: { $exists: false } },
      [
        {
          $set: {
            teamMemberWorkdayId: {
              $let: {
                vars: {
                  teamMember: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: teamMembers,
                          cond: { $eq: ["$$this.workEmailAddress", "$teamMemberEmail"] }
                        }
                      },
                      0
                    ]
                  }
                },
                in: "$$teamMember.workdayId"
              }
            }
          }
        }
      ]
    );

    console.log(`Updated ${updatedTasks.modifiedCount} TeamMemberTask entries with missing workdayId`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
updateTeamMemberWorkdayId();

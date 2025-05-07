const mongoose = require('mongoose');
const config = require('../config/config');
const TeamMemberTask = require('../models/TeamMemberTask');
const TeamMemberEvent = require('../models/TeamMemberEvent');
const TeamMember = require('../models/TeamMember');

async function updateTeamMemberWorkdayId() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/tip", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');

    // Get all team members
    const teamMembers = await TeamMember.find({});
    if (teamMembers.length === 0) {
      logger.error('No team members found');
      process.exit(1);
    }

    // Update TeamMemberTask entries with missing workdayId
    const updatedTasks = await TeamMemberEvent.updateMany(
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
                          cond: { $eq: ["$$this.email", "$teamMemberEmail"] }
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

    logger.info(`Updated ${updatedTasks.modifiedCount} TeamMemberTask entries with missing workdayId`);

  } catch (error) {
    logger.error(`Error updating workday IDs: ${error.message}`);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  }
}

// Run the script
updateTeamMemberWorkdayId();

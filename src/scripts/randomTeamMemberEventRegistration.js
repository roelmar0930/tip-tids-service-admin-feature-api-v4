
const mongoose = require('mongoose');
const TeamMemberEvent = require('../models/TeamMemberEvent');
const dotenv = require('dotenv');
dotenv.config();
const getConfig = require('../config/config');

// Possible event statuses
const EVENT_STATUSES = ['registered'];

async function randomTeamMemberEventRegistration(eventId, numberOfMembers) {
  try {
    // Get configuration
    const config = await getConfig();

    // Connect to the database
    await mongoose.connect(config.databaseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Find existing team member events for the given event
    const existingTeamMemberEvents = await TeamMemberEvent.find({ eventId: eventId });

    // If no existing events or fewer than requested, throw an error
    if (existingTeamMemberEvents.length === 0) {
      throw new Error(`No team members found for event ${eventId}`);
    }

    // Randomly select team members to update
    const selectedMembers = [];
    const membersCopy = [...existingTeamMemberEvents];
    
    const membersToUpdate = Math.min(numberOfMembers, existingTeamMemberEvents.length);
    
    for (let i = 0; i < membersToUpdate; i++) {
      const randomIndex = Math.floor(Math.random() * membersCopy.length);
      selectedMembers.push(membersCopy.splice(randomIndex, 1)[0]);
    }

    // Update statuses for selected team members
    const bulkWriteOperations = selectedMembers.map(member => ({
      updateOne: {
        filter: { 
          eventId: member.eventId, 
          teamMemberWorkdayId: member.teamMemberWorkdayId 
        },
        update: { 
          $set: { 
            status: EVENT_STATUSES[0] 
          } 
        }
      }
    }));

    // Perform bulk write operations
    const result = await TeamMemberEvent.bulkWrite(bulkWriteOperations);

    console.log(`Successfully updated ${result.modifiedCount} team members for event ${eventId}`);
    
    return result;
  } catch (error) {
    console.error('Error in random team member event registration:', error);
    throw error;
  } finally {
    // Close the database connection
    await mongoose.connection.close();
  }
}

// Allow script to be run directly or imported
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('Usage: node randomTeamMemberEventRegistration.js <eventId> <numberOfMembers>');
    process.exit(1);
  }

  const [eventId, numberOfMembers] = args;

  randomTeamMemberEventRegistration(eventId, parseInt(numberOfMembers))
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = randomTeamMemberEventRegistration;

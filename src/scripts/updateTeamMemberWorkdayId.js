const mongoose = require('mongoose');
const TeamMemberEvent = require('../models/TeamMemberEvent');
const TeamMember = require('../models/TeamMember');

const MONGO_URI = 'mongodb://prod3ngagementAppV4:vF52xhXy4hYst6S@34.124.155.234:27017/tip';

async function updateTeamMemberWorkdayIdsAndRemoveDuplicates() {
  try {
    // Connect to the specific database
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB (Production)');

    // First, get all team members with their workdayIds and emails
    const teamMembers = await TeamMember.find({}, { workdayId: 1, workEmailAddress: 1 });
    console.log(`Found ${teamMembers.length} team members`);

    // Create a map of workEmailAddress to workdayId for faster lookup
    const workdayIdMap = new Map(
      teamMembers.filter(member => member.workEmailAddress)
        .map(member => [member.workEmailAddress.toLowerCase(), member.workdayId])
    );

    console.log(`Created workdayId map with ${workdayIdMap.size} entries`);

    // Fetch all documents from TEAM_MEMBER_EVENT collection
    const teamMemberEvents = await TeamMemberEvent.find({});
    console.log(`Found ${teamMemberEvents.length} team member events`);

    let updatedCount = 0;
    let skippedCount = 0;
    let removedDuplicatesCount = 0;

    // Create a Set to track unique combinations of eventId and teamMemberWorkdayId
    const uniqueEventMembers = new Set();

    // Update each event with the correct workdayId from the team member and remove duplicates
    for (const event of teamMemberEvents) {
      try {
        if (!event.teamMemberEmail || !event.eventId) {
          console.warn(`Skipped event ${event._id}: Missing teamMemberEmail or eventId`);
          skippedCount++;
          continue;
        }

        const email = event.teamMemberEmail.toLowerCase();
        const workdayId = workdayIdMap.get(email);

        if (!workdayId) {
          console.warn(`Skipped event ${event._id}: No workday ID found for team member email ${email}`);
          skippedCount++;
          continue;
        }

        const uniqueKey = `${event.eventId}-${workdayId}-${email}`;

        if (uniqueEventMembers.has(uniqueKey)) {
          // This is a duplicate, remove it
          await TeamMemberEvent.deleteOne({ _id: event._id });
          removedDuplicatesCount++;
          console.log(`Removed duplicate event ${event._id} for eventId ${event.eventId}, workday ID ${workdayId}, and email ${email}`);
          continue;
        }

        uniqueEventMembers.add(uniqueKey);

        // Update the workdayId if it's different
        if (event.teamMemberWorkdayId !== workdayId) {
          event.teamMemberWorkdayId = workdayId;
          await event.save();
          updatedCount++;
          console.log(`Updated event ${event._id} with workday ID: ${workdayId} for team member email ${email}`);
        } else {
          console.log(`Skipped event ${event._id}: WorkdayId already up to date`);
          skippedCount++;
        }
      } catch (eventError) {
        console.error(`Error processing event ${event._id}:`, eventError);
        skippedCount++;
      }
    }

    console.log(`Update complete:
    - ${updatedCount} events updated successfully
    - ${skippedCount} events skipped (no matching workday ID found or already up to date)
    - ${removedDuplicatesCount} duplicate events removed`);
  } catch (error) {
    console.error('Error updating team member workday IDs and removing duplicates:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

updateTeamMemberWorkdayIdsAndRemoveDuplicates();

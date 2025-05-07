const TeamMemberEvent = require("../models/TeamMemberEvent");
const TeamMemberPointsService = require("../services/TeamMemberPointsService");
const Event = require("../models/Event");

// Function to add points for completed event
async function addPointsForCompletedEvent(eventId) {
  try {
    const event = await Event.findOne({ id: eventId });
    
    if (!event) {
      console.error(`Event details not found for event ID: ${eventId}`);
      return;
    }

    const { category, pointsNum: points } = event;

    const teamMemeberEvents = await getTeamMemberEvent(eventId);

    if (teamMemeberEvents.length === 0) {
      console.log("No eligible registrations found for points.");
      return;
    }

    for (const teamMember of teamMemeberEvents) {
      
      await awardPointsToTeamMember(teamMember, points, category);
    }
  } catch (error) {
    console.error(`Failed to process event ${eventId}:`, error);
  }
}

// Helper to fetch teamMemberEvent for the given event ID
async function getTeamMemberEvent(eventId) {
  return TeamMemberEvent.find({
    eventId: eventId,
    isPointsAwarded: false,
    status: "registered",
  });
}

async function awardPointsToTeamMember(teamMember, points, category) {

  if (!teamMember.teamMemberEmail || !teamMember.teamMemberWorkdayId) {
    console.error("Team member email or Workday ID is missing.");
    return;
  }

  await TeamMemberPointsService.addPoints({
    teamMemberEmail: teamMember.teamMemberEmail,
    teamMemberWorkdayId: teamMember.teamMemberWorkdayId,
    points,
    category,
  });

  teamMember.isPointsAwarded = true;
  await teamMember.save();
  console.log(`Points awarded and saved for ${teamMember.teamMemberEmail}`);
}

module.exports = addPointsForCompletedEvent;

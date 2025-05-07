const TeamMemberEvent = require("../models/TeamMemberEvent");
const TeamMemberPointsService = require("../services/TeamMemberPointsService");
const Event = require("../models/Event");
const logger = require("../utils/Logger");

// Function to add points for completed event
async function addPointsForCompletedEvent(eventId) {
  try {
    const event = await Event.findOne({ id: eventId });
    
    if (!event) {
      logger.error(`Event details not found for event ID: ${eventId}`);
      return;
    }

    const { category, pointsNum: points } = event;

    const teamMemberEvents = await getTeamMemberEvent(eventId);

    if (teamMemberEvents.length === 0) {
      logger.info("No eligible registrations found for points.");
      return;
    }

    for (const teamMember of teamMemberEvents) {
      await awardPointsToTeamMember(teamMember, points, category);
    }
  } catch (error) {
    logger.error(`Failed to process event ${eventId}: ${error.message}`);
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
    logger.error(`Team member email or Workday ID is missing for team member: ${teamMember._id}`);
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
}

module.exports = addPointsForCompletedEvent;

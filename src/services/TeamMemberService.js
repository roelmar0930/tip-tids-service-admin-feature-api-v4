const TeamMember = require("../models/TeamMember");
const TeamMemberEvent = require("../models/TeamMemberEvent");
const EventsService = require("./EventsService");
const createHttpError = require("http-errors");
const logger = require("../utils/Logger");

class TeamMemberService {
  async getAllTeamMember(query) {
    try {
      const teamMembers = await TeamMember.find(query);
      if (teamMembers.length > 0) {
        return teamMembers;
      } else {
        logger.error("Team members not found");
        throw new Error("Team members not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async getTeamMember(query) {
    try {
      const teamMember = await TeamMember.findOne(query);
      if (!teamMember) {
        logger.error("404 Team member not found");
        throw new createHttpError(404, "Team member not found");
      }
      return teamMember;
    } catch (error) {
      throw error;
    }
  }

  async addEvent(query, eventBody) {
    try {
      const request = {
        id: query.eventId,
      };
      const event = await EventsService.getEventDetails(request);

      const eventExistInTeamMember = await TeamMemberEvent.findOne({
        eventId: event.id,
        teamMemberWorkdayId: eventBody.teamMemberWorkdayId,
        teamMemberEmail: eventBody.teamMemberEmail,
      });

      if (eventExistInTeamMember) {
        logger.error("409 Team member already has this event assigned");
        throw new createHttpError(
          409,
          "Team member already has this event assigned"
        );
      }

      const teamMemberEvent = new TeamMemberEvent({
        ...eventBody,
        eventId: event.id,
      });

      await teamMemberEvent.save();
      logger.info("Team member event created:" + teamMemberEvent);
      console.log("Team member event created:", teamMemberEvent);

      return teamMemberEvent;
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(query, eventBody) {
    try {
      const request = {
        id: query.eventId,
      };
      const event = await EventsService.getEventDetails(request);

      if (!event) {
        logger.error("409 Event not found");
        throw new createHttpError(409, "Event not found");
      }

      const teamMemberEvent = await TeamMemberEvent.findOne({
        eventId: event.id,
        ...query,
      });

      if (!teamMemberEvent) {
        logger.error("409 Team member event not found");
        throw new createHttpError(409, "Team member event not found");
      }

      teamMemberEvent.set(eventBody);

      await teamMemberEvent.save();
      logger.info("Team member event updated:" + teamMemberEvent);
      console.log("Team member event updated:", teamMemberEvent);

      return teamMemberEvent;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TeamMemberService();

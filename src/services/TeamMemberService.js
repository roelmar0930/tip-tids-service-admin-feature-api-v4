const TeamMember = require("../models/TeamMember");
const TeamMemberEvent = require("../models/TeamMemberEvent");
const EventsService = require("./EventsService");
const createHttpError = require("http-errors");

class TeamMemberService {
  async getAllTeamMember() {
    try {
      const teamMembers = await TeamMember.find();
      if (teamMembers.length > 0) {
        return teamMembers;
      } else {
        throw new Error("Team members not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async getTeamMemberInfoByEmail(workEmailAddress) {
    try {
      const teamMember = await TeamMember.findOne({ workEmailAddress });
      if (!teamMember) {
        throw new createHttpError(404, "Team member not found");
      }
      return teamMember;
    } catch (error) {
      throw error;
    }
  }

  async getTeamMemberInfoByWorkorderId(workdayId) {
    try {
      const teamMember = await TeamMember.findOne({ workdayId });
      if (!teamMember) {
        throw new createHttpError(404, "Team member not found");
      }
      return teamMember;
    } catch (error) {
      throw error;
    }
  }

  async getTeamMemberListByManager(immediateManagerWorkorderId) {
    try {
      const teamMembers = await TeamMember.find({
        immediateManagerWorkorderId,
      });

      if (!teamMembers) {
        throw new createHttpError(404, "Team roster not found");
      }

      const teamManagerInfo = await TeamMember.findOne({
        workdayId: immediateManagerWorkorderId,
      });

      if (!teamManagerInfo) {
        throw new createHttpError(404, "Team manager not found");
      }

      return {
        teamManagerInfo,
        teamMembers,
      };
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
      });

      if (eventExistInTeamMember) {
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
        throw new createHttpError(409, "Event not found");
      }

      const teamMemberEvent = await TeamMemberEvent.findOne({
        eventId: event.id,
        ...query,
      });

      if (!teamMemberEvent) {
        throw new createHttpError(409, "Team member event not found");
      }

      teamMemberEvent.set(eventBody);

      await teamMemberEvent.save();
      console.log("Team member event created:", teamMemberEvent);

      return teamMemberEvent;
    } catch (error) {
      throw error;
    }
  }

  async getEvents(query) {
    try {
      const teamMemberEvent = await TeamMemberEvent.find(query);

      return teamMemberEvent;
    } catch (error) {
      throw error;
    }
  }

  async getAllEventDetails(query) {
    try {
      const teamMemberEvents = await TeamMemberEvent.find(query);

      const events = await Promise.all(
        teamMemberEvents.map(async (teamMemberEvent) => {
          const request = { id: teamMemberEvent.eventId };
          const event = await EventsService.getEventDetails(request);

          const cleanedEvent = {
            ...event._doc,
            teamMemberRegistrationStatus: teamMemberEvent.status,
          };

          return cleanedEvent;
        })
      );

      return events;
    } catch (error) {
      console.error("Error fetching event details:", error);
      throw error;
    }
  }
}

module.exports = new TeamMemberService();

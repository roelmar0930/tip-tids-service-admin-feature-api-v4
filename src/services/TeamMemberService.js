const TeamMember = require("../models/TeamMember");
const TeamMemberEvent = require("../models/TeamMemberEvent");
const EventsService = require("./EventsService");
const createHttpError = require("http-errors");
const logger = require("../utils/Logger");
const { formatDateToManilaUTC } = require("../utils/DateUtils");

class TeamMemberService {
  parseManagerInfo(managerString) {
    if (!managerString) return { name: null, workdayId: null };
    const match = managerString.match(/(.+)\s*\((\d+)\)/);
    if (match) {
      return {
        name: match[1].trim(),
        workdayId: match[2]
      };
    }
    return { name: managerString, workdayId: null };
  }

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
      return teamMemberEvent;
    } catch (error) {
      throw error;
    }
  }

  async bulkSyncTeamMembers(csvData) {
    try {
      let updatedCount = 0;
      let addedCount = 0;
      let terminatedCount = 0;

      // Get all existing workday IDs
      const existingWorkdayIds = new Set((await TeamMember.find({}, 'workdayId')).map(tm => tm.workdayId));

      // Create a set of workday IDs from the CSV data
      const csvWorkdayIds = new Set(csvData.map(row => row["Workday ID"]));

      for (const row of csvData) {
        const teamMemberData = {
          workdayId: row["Workday ID"],
          firstName: row["Legal Name - First Name"],
          lastName: row["Legal Name - Last Name"],
          middleName: row["Legal Name - Middle Name"],
          suffix: row["Legal Name - Social Suffix"],
          email: row["Work Email Address"],
          jobProfile: row["Job Profile"],
          bussinessTitle: row["Business Title"],
          jobCode: row["Job Code"],
          supervisor: {
            email: row["Supervisor's Work Email"],
            ...this.parseManagerInfo(row["Immediate Manager"])
          },
          operationalManager: {
            ...this.parseManagerInfo(row["Operations/Practice Manager"]),
          },
          functionalArea: row["Functional Area"],
          site: row["Site"],
          originalHireDate: row["Original Hire Date"] ? formatDateToManilaUTC(new Date(row["Original Hire Date"])) : null,
          hireDate: row["Hire Date"] ? formatDateToManilaUTC(new Date(row["Hire Date"])) : null,
          continuousServiceDate: row["Continuous Service Date"] ? formatDateToManilaUTC(new Date(row["Continuous Service Date"])) : null,
          yearOfService: row["Years of Service"] ? parseInt(row["Years of Service"]) : null,
          employeeType: row["Employee Type"],
          practice: row["Practice"],
          group: row["Group"],
          status: row["HR Status"]?.toLowerCase() === "terminated" ? "terminated" : "active",
          updatedAt: new Date()
        };

        if (existingWorkdayIds.has(teamMemberData.workdayId)) {
          // Update existing team member
          await TeamMember.updateOne(
            { workdayId: teamMemberData.workdayId },
            { $set: teamMemberData }
          );
          updatedCount++;
        } else {
          // Add new team member
          const newTeamMember = new TeamMember(teamMemberData);
          await newTeamMember.save();
          addedCount++;
        }

        // Remove this workday ID from the set of existing IDs
        existingWorkdayIds.delete(teamMemberData.workdayId);
      }

      // Terminate team members that exist in the database but not in the CSV
      for (const workdayId of existingWorkdayIds) {
        await TeamMember.updateOne(
          { workdayId },
          { $set: { status: "terminated", updatedAt: new Date() } }
        );
        terminatedCount++;
      }

      return { updatedCount, addedCount, terminatedCount };
    } catch (error) {
      logger.error("Error in bulkSyncTeamMembers: " + error);
      throw error;
    }
  }
}

module.exports = new TeamMemberService();

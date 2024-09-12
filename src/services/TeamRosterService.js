const TeamRoster = require("../models/TeamRoster");
const createHttpError = require("http-errors");

class TeamRosterService {
  async getAllTeamMember() {
    try {
      const teamMembers = await TeamRoster.find();
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
      const teamMember = await TeamRoster.findOne({ workEmailAddress });
      if (!teamMember) {
        throw new createHttpError(404, "Team member not found");
      }
      return teamMember;
    } catch (error) {
      throw error;
    }
  }

  async getTeamMemberInfoByWorkorderId(workorderId) {
    try {
      const teamMember = await TeamRoster.findOne({ workorderId });
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
      const teamMembers = await TeamRoster.find({
        immediateManagerWorkorderId,
      });

      if (!teamMembers) {
        throw new createHttpError(404, "Team roster not found");
      }

      const teamManagerInfo = await TeamRoster.findOne({
        workorderId: immediateManagerWorkorderId,
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
}

module.exports = new TeamRosterService();

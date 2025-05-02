const TeamMemberPoints = require("../models/TeamMemberPoints");
const TeamMemberService = require("./TeamMemberService");
const logger = require("../utils/Logger");

class TeamMemberPointsService {
  async getTeamMemeberPoints(query) {
    try {
      const teamMemberPoints = await TeamMemberPoints.find(query);
      return teamMemberPoints;
    } catch (error) {
      throw error;
    }
  }

  async addPoints(body) {
    try {
      const { teamMemberEmail, teamMemberWorkdayId, points, category } = body;

      const yearToday = new Date().getFullYear();

      // Find the team member point for the current year
      let currentYearPoints = await TeamMemberPoints.findOne({
        teamMemberEmail: teamMemberEmail,
        teamMemberWorkdayId: teamMemberWorkdayId,
        year: yearToday,
      });

      // If no record is found, retrieve team member info and create a new record
      if (!currentYearPoints) {
        const teamMemberInfo = await TeamMemberService.getTeamMember({
          workdayId: teamMemberWorkdayId,
          email: teamMemberEmail,
        });

        if (teamMemberInfo) {
          currentYearPoints = new TeamMemberPoints({
            year: yearToday,
            teamMemberWorkdayId: teamMemberInfo.workdayId,
            teamMemberEmail: teamMemberInfo.email,
            starPoints: 0,
            starsPesoConversion: 0,
            starsDeduction: 0,
            copPoints: 0,
            copPesoConversion: 0,
            copDeduction: 0,
          });
          await currentYearPoints.save();
        } else {
          logger.error("Team member not found in roster");
          throw new Error("Team member not found in roster");
        }
      }

      if (category === "COP") {
        currentYearPoints.copPoints =
          (currentYearPoints.copPoints || 0) + points;
      } else {
        currentYearPoints.starPoints =
          (currentYearPoints.starPoints || 0) + points;
      }

      // Save the updated record
      await currentYearPoints.save();
      logger.info("Points added successfully");
      return { success: true, message: "Points added successfully" };
    } catch (error) {
      logger.error("Error : " + error);
      console.error("Error:", error);
    }
  }
}

module.exports = new TeamMemberPointsService();

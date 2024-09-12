const TeamMemberPoints = require("../models/TeamMemberPoints");
const TeamRosterService = require("./TeamRosterService");

class TeamMemberService {
  async getTeamMemeberPointsByEmail(email) {
    try {
      const teamMemberPoints = await TeamMemberPoints.find({ email });
      if (teamMemberPoints.length > 0) {
        return teamMemberPoints;
      } else {
        throw new Error("Team members not found");
      }
    } catch (error) {
      throw error;
    }
  }

  async addPoints(email, points, category) {
    try {
      const yearToday = new Date().getFullYear();

      // Find the team member point for the current year
      let currentYearPoints = await TeamMemberPoints.findOne({
        email,
        year: yearToday,
      });

      // If no record is found, retrieve team member info and create a new record
      if (!currentYearPoints) {
        const teamMemberInfo = await TeamRosterService.getTeamMemberInfoByEmail(
          email
        );

        if (teamMemberInfo) {
          currentYearPoints = new TeamMemberPoints({
            year: yearToday,
            workdayId: teamMemberInfo.workorderId,
            employeeName: teamMemberInfo.employeeName,
            email, // Ensure email is correctly used here
            copPoints: 0,
            starPoints: 0,
          });
          await currentYearPoints.save();
        } else {
          throw new Error("Team member not found in roster");
        }
      }

      // Update the points based on category
      if (category === "COP") {
        currentYearPoints.copPoints =
          (currentYearPoints.copPoints || 0) + points;
      } else {
        currentYearPoints.starPoints =
          (currentYearPoints.starPoints || 0) + points;
      }

      // Save the updated record
      await currentYearPoints.save();
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

module.exports = new TeamMemberService();

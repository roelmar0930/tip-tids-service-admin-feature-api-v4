const TeamMemberPointsService = require("../services/TeamMemberPointsService");

const getTeamMemberPoints = async (req, res, next) => {
  try {
    const teamMember = await TeamMemberPointsService.getTeamMemeberPoints(
      req.query
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const addPoints = async (req, res, next) => {
  try {
    const teamMember = await TeamMemberPointsService.addPoints(req.body);
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTeamMemberPoints, addPoints };

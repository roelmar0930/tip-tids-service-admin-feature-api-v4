const TeamMemberPointsService = require("../services/TeamMemberPointsService");

const getTeamMemberPointsByEmail = async (req, res, next) => {
  const { email } = req.params;

  // Check if the email parameter is missing or invalid
  if (!email || !email.includes("@")) {
    return next(400, "Invalid or missing email parameter");
  }

  try {
    const teamMember =
      await TeamMemberPointsService.getTeamMemeberPointsByEmail(email);
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const addPoints = async (req, res) => {
  try {
    const teamMember = await TeamMemberPointsService.addPoints(
      req.body.email,
      req.body.pointsToAdd,
      req.body.category
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTeamMemberPointsByEmail, addPoints };

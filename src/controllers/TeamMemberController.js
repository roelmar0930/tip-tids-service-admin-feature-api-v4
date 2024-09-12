const TeamMemberService = require("../services/TeamMemberService");

const getTeamMemberInfoByName = async (req, res) => {
  const teamMember = await TeamMemberService.getTeamMemberInfoByName(
    req.params.employeeName
  );
  if (teamMember.length > 0) {
    return res.send(teamMember);
  }
  res.status(404).json({ message: "not found" });
};

const addStarPoints = async (req, res) => {
  try {
    const teamMember = await TeamMemberService.addStarPoints(
      req.body.employeeName,
      req.body.pointsToAdd
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const checkDuplicates = async (req, res) => {
  const teamMember = await TeamMemberService.checkDuplicates(
    req.params.email,
    req.params.eventId
  );
  res.status(200).json(teamMember);
};

module.exports = { getTeamMemberInfoByName, addStarPoints, checkDuplicates };

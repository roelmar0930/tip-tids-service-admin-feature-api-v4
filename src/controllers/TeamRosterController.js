const TeamRosterService = require("../services/TeamRosterService");

const getAllTeamMember = async (req, res) => {
  try {
    const teamMembers = await TeamRosterService.getAllTeamMember();
    res.status(200).json(teamMembers);
  } catch (error) {
    next(error);
  }
};

const getTeamMemberInfoByEmail = async (req, res, next) => {
  const { workEmailAddress } = req.params;

  // Check if the email parameter is missing or invalid
  if (!workEmailAddress || !workEmailAddress.includes("@")) {
    return next(400, "Invalid or missing email parameter");
  }

  try {
    const teamMember = await TeamRosterService.getTeamMemberInfoByEmail(
      workEmailAddress
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const getTeamMemberInfoByWorkorderId = async (req, res, next) => {
  const { workorderId } = req.params;
  try {
    const teamMember = await TeamRosterService.getTeamMemberInfoByWorkorderId(
      workorderId
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const getTeamMemberListByManager = async (req, res, next) => {
  const { immediateManagerWorkorderId } = req.params;

  try {
    const teamMember = await TeamRosterService.getTeamMemberListByManager(
      immediateManagerWorkorderId
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeamMember,
  getTeamMemberInfoByEmail,
  getTeamMemberInfoByWorkorderId,
  getTeamMemberListByManager,
};

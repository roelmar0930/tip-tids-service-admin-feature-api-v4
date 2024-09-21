const TeamMemberService = require("../services/TeamMemberService");

const getAllTeamMember = async (req, res) => {
  try {
    const teamMembers = await TeamMemberService.getAllTeamMember();
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
    const teamMember = await TeamMemberService.getTeamMemberInfoByEmail(
      workEmailAddress
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const getTeamMemberInfoByWorkorderId = async (req, res, next) => {
  const { workdayId } = req.params;
  try {
    const teamMember = await TeamMemberService.getTeamMemberInfoByWorkorderId(
      workdayId
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const getTeamMemberListByManager = async (req, res, next) => {
  const { immediateManagerWorkorderId } = req.params;

  try {
    const teamMember = await TeamMemberService.getTeamMemberListByManager(
      immediateManagerWorkorderId
    );
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const addEvent = async (req, res, next) => {
  try {
    const teamMemberEvent = await TeamMemberService.addEvent(
      req.query,
      req.body
    );
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const teamMemberEvent = await TeamMemberService.updateEvent(
      req.query,
      req.body
    );
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const teamMemberEvent = await TeamMemberService.getEvents(req.query);
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

const getAllEventDetails = async (req, res, next) => {
  try {
    const teamMemberEvent = await TeamMemberService.getAllEventDetails(
      req.query
    );
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeamMember,
  getTeamMemberInfoByEmail,
  getTeamMemberInfoByWorkorderId,
  getTeamMemberListByManager,
  addEvent,
  updateEvent,
  getEvents,
  getAllEventDetails,
};

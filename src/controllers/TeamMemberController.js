const TeamMemberService = require("../services/TeamMemberService");

const getAllTeamMember = async (req, res, next) => {
  try {
    const teamMembers = await TeamMemberService.getAllTeamMember(req.query);
    res.status(200).json(teamMembers);
  } catch (error) {
    next(error);
  }
};

const getTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMemberService.getTeamMember(req.query);
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

module.exports = {
  getAllTeamMember,
  getTeamMember,
  addEvent,
  updateEvent,
};

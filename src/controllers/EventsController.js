const EventsService = require("../services/EventsService");

const getAllEvents = async (req, res, next) => {
  try {
    const events = await EventsService.getAllEvents(req.query, req.timeZone);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  const eventData = req.body;
  const imageFile = req.file;
  try {
    const event = await EventsService.createEvent(eventData, imageFile, req.timeZone);
    
    // If specific team members are provided, invite only them, otherwise invite all
    const teamMembers = eventData.teamMembers ? JSON.parse(eventData.teamMembers) : [];
    const result = await EventsService.bulkInviteEvent(event._id, teamMembers);
    
    res.status(200).json({
      event,
      inviteResult: result
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  const updatedDetails = req.body;
  const imageFile = req.file;
  try {
    const event = await EventsService.updateEvent(updatedDetails, imageFile, req.timeZone);
    
    // If specific team members are provided, invite only them, otherwise invite all
    const teamMembers = updatedDetails.teamMembers ? JSON.parse(updatedDetails.teamMembers) : [];
    const result = await EventsService.bulkInviteEvent(event._id, teamMembers);
    
    res.status(200).json({
      event,
      inviteResult: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await EventsService.deleteEvent(req.params.id, req.body);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const inviteTeamMember = async (req, res, next) => {
  try {
    const teamMemberEvent = await EventsService.inviteTeamMember(
      req.query,
      req.body
    );
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

const updateInviteTeamMember = async (req, res, next) => {
  try {
    const teamMemberEvent = await EventsService.updateInvitedTeamMember(
      req.query,
      req.body
    );
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

const getTeamMemberEvent = async (req, res, next) => {
  try {
    const teamMemberEvent = await EventsService.getTeamMemberEvent(req.query, req.timeZone);
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

const getEventDetails = async (req, res, next) => {
  try {
    const eventWithInvitees = await EventsService.getEventDetails(req.params.id, req.timeZone);
    res.status(200).json(eventWithInvitees);
  } catch (error) {
    next(error);
  }
};

const bulkAssignEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { teamMembers } = req.body;
    
    const result = await EventsService.bulkInviteEvent(eventId, teamMembers || []);
    res.status(200).json({ 
      message: `Successfully invited ${result.invitedCount} team members to event (${result.mode} mode)`,
      result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  inviteTeamMember,
  updateInviteTeamMember,
  getTeamMemberEvent,
  getEventDetails,
  bulkAssignEvent
};

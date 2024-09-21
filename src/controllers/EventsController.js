const EventsService = require("../services/EventsService");

const getAllEvents = async (req, res, next) => {
  try {
    const events = await EventsService.getAllEvents(req.query);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const getEventDetails = async (req, res, next) => {
  try {
    const details = await EventsService.getEventDetails(req.query);
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  const eventData = req.body;
  const imageFile = req.file;
  try {
    const event = await EventsService.createEvent(eventData, imageFile);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  const updatedDetails = req.body;
  const imageFile = req.file;
  try {
    const event = await EventsService.updateEvent(updatedDetails, imageFile);
    res.status(200).send(event);
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

module.exports = {
  getAllEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
};

const EventsService = require("../services/EventsService");

const getAllEvents = async (req, res, next) => {
  try {
    const events = await EventsService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const getEventDetailsByDate = async (req, res, next) => {
  try {
    console.log(req.body);
    const eventDetails = await EventsService.getEventDetailsByDate(req.body);
    res.status(200).json(eventDetails);
  } catch (error) {
    next(error);
  }
};

const getEventDetails = async (req, res, next) => {
  try {
    const eventDetails = await EventsService.getEventDetails(
      req.params.eventId
    );
    res.status(200).json(eventDetails);
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const registration = await EventsService.register(req.body);
    res.status(200).json(registration);
  } catch (error) {
    next(error);
  }
};

const getRegisteredEvents = async (req, res, next) => {
  try {
    const events = await EventsService.getRegisteredEvents(req.params.email);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const getUnregisteredEvents = async (req, res, next) => {
  try {
    const events = await EventsService.getUnregisteredEvents(req.params.email);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const eventData = req.body;
    const imageFile = req.file;
    let imageUrl = "";

    if (imageFile) {
      const imageBuffer = imageFile.buffer;
      const fileName = `images/${Date.now()}-${imageFile.originalname}`;
      imageUrl = await EventsService.uploadImage(imageBuffer, fileName);
      eventData.imageUrl = imageUrl;
    }

    const event = await EventsService.createEvent(eventData, imageFile);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  const { eventId } = req.params;
  const updatedDetails = req.body;
  const imageFile = req.file;
  try {
    if (imageFile) {
      const imageBuffer = imageFile.buffer;
      const fileName = `images/${Date.now()}-${imageFile.originalname}`;
      const imageUrl = await EventsService.uploadImage(imageBuffer, fileName);
      updatedDetails.imageUrl = imageUrl;
    }

    const event = await EventsService.updateEvent(eventId, updatedDetails);
    res.status(200).send(event);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const event = await EventsService.deleteEvent(req.params.eventId, req.body);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEventDetailsByDate,
  getEventDetails,
  register,
  getUnregisteredEvents,
  getRegisteredEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};

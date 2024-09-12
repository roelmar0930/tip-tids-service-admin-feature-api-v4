const Event = require("../models/Event");
const Registration = require("../models/Registration");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { bucket } = require("../utils/StorageUtil");
const createHttpError = require("http-errors");
const { formatDateToISOWithOffset } = require("../utils/DateUtils");
const ChangeLog = require("../models/ChangeLog");

class EventsService {
  async getAllEvents() {

    
    const events = await Event.find();
    return events;
  }

  async getEventDetailsByDate(eventBody) {
    const targetDate = new Date(eventBody.startDate);
    const startDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );
    const endDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate() + 1
    );
    const eventDetails = await Event.find({
      startDate: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "Completed",
    });
    return eventDetails;
  }

  async getEventDetails(eventId) {
    const eventDetails = await Event.find({ eventId: eventId });
    return eventDetails;
  }

  async register(registrationBody) {
    const registration = await Registration.create(registrationBody);
    return registration;
  }

  async getRegisteredEvents(email) {
    const registeredEventIds = await getRegisteredEventIds(email);
    const registeredEvents = await Event.find({
      eventId: { $in: registeredEventIds },
    });
    return registeredEvents;
  }

  async getUnregisteredEvents(email) {
    // Get the IDs of events registered by the email
    const registeredEventIds = await getRegisteredEventIds(email);
    const unregisteredEvents = await Event.find({
      eventId: { $nin: registeredEventIds },
    });
    return unregisteredEvents;
  }

  async createEvent(eventData, imageFile) {
    try {
      const { title, venueDetails } = eventData;

      // Upload image if provided
      let imageUrl = "";

      const now = new Date();
      const datePart = now.toISOString().split("T")[0]; // Get the date part
      const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-");

      if (imageFile) {
        console.log("Calling uploadImage function...");
        const fileName = `images/${title}-${datePart}-${timePart}-${imageFile.originalname}`;
        imageUrl = await this.uploadImage(imageFile.buffer, fileName);
      } else {
        imageUrl = `https://storage.cloud.google.com/${bucket.name}/images/DefaultEventImage.png`;
      }

      // Create the event object with image URL
      const event = new Event({
        ...eventData,
        imageUrl,
        qrCodeUrl: eventData.qrCodeUrl,
      });

      // Generate the next eventId
      const count = await Event.find().sort({ eventId: 1 });
      if (count.length === 0) {
        event.eventId = 1;
      } else {
        event.eventId = count[count.length - 1].eventId + 1;
      }

      // Save the event
      await event.save();
      console.log("Event created:", event);
      return event;
    } catch (error) {
      console.log("Error creating event:", error.message);
      throw error;
    }
  }

  async updateEvent(eventId, updatedDetails, imageFile) {
    try {
      const event = await Event.findOne({ eventId: eventId }); // Find the event to update
      const oldData = event.toObject();

      if (!event) {
        throw new createHttpError(404, "Event not found");
      }
      const { title } = updatedDetails;
      let imageUrl = event.imageUrl;
      const now = new Date();
      const datePart = now.toISOString().split("T")[0]; // Get the date part
      const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-");

      if (imageFile) {
        console.log("Calling uploadImage function...");

        const fileName = `"images/${title}-${datePart}-${timePart}-${imageFile.originalname}"`;
        imageUrl = await this.uploadImage(imageFile.buffer, fileName);
        console.log("Image URL:", imageUrl);

        event.imageUrl = imageUrl;
      }

      event.set(updatedDetails);

      await event.save();

      // Log changes
      for (const key of Object.keys(updatedDetails)) {
        const oldValue = oldData[key];
        const newValue = updatedDetails[key];

        // Ensure only changed fields are logged
        if (oldValue !== newValue) {
          await ChangeLog.create({
            modelName: "Event",
            documentId: event._id,
            field: key,
            oldValue,
            newValue,
            action: "update",
          });
        }
      }

      console.log("Event updated:", event);
      return event;
    } catch (error) {
      throw error;
    }
  }

  async uploadImage(imageBuffer, fileName) {
    try {
      console.log(
        "Uploading image:",
        fileName,
        "Buffer size:",
        imageBuffer.length
      );
      const file = bucket.file(fileName);
      await file.save(imageBuffer);

      const authenticatedURL = `https://storage.cloud.google.com/${bucket.name}/${file.name}`;
      console.log("Image uploaded. Public URL:", authenticatedURL);

      return authenticatedURL;
    } catch (error) {
      console.log("Error uploading image:", error.message);
      throw error;
    }
  }

  async deleteEvent(eventId, eventBody) {
    const event = await Event.findOneAndUpdate(
      { eventId: eventId },
      eventBody,
      { new: true, useFindAndModify: false }
    );
    return event;
  }
}

async function getRegisteredEventIds(email) {
  const registrations = await Registration.find({ email });
  return registrations.map((registration) => registration.eventId);
}

module.exports = new EventsService();

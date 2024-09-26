const Event = require("../models/Event");
const ImageService = require("../services/ImageService");
const createHttpError = require("http-errors");

class EventsService {
  async getAllEvents(query) {
    const events = await Event.find(query);
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
    const details = await Event.find({
      startDate: {
        $gte: startDate,
        $lt: endDate,
      },
      status: "Completed",
    });
    return details;
  }

  async getEventDetails(query) {
    try {
      const eventDetails = await Event.findOne(query);

      if (!eventDetails) {
        throw new createHttpError(404, "Event not found");
      }

      return eventDetails;
    } catch (error) {
      throw error;
    }
  }

  async createEvent(eventData, imageFile) {
    try {
      const { title } = eventData;

      // Upload image if provided
      let imageFilename = "";

      const now = new Date();
      const titlePart = title.replace(/\s+/g, "-").toLowerCase();
      const datePart = now.toISOString().split("T")[0];
      const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-");

      if (imageFile) {
        const imageBuffer = imageFile.buffer;
        const fileName = `${titlePart}-${datePart}-${timePart}`;
        await ImageService.uploadImage(
          imageBuffer,
          `images/${process.env.NODE_ENV}/event/${fileName}`
        );
        imageFilename = fileName;
      } else {
        imageFilename = `DefaultEventImage`;
      }

      // Create the event object with image URL
      const event = new Event({
        ...eventData,
        imageFilename,
        qrCodeUrl: eventData.qrCodeUrl,
      });

      // Save the event
      await event.save();
      console.log("Event created:", event);
      return event;
    } catch (error) {
      console.log("Error creating event:", error.message);
      throw error;
    }
  }

  async updateEvent(updatedDetails, imageFile) {
    try {
      const event = await Event.findOne({ id: updatedDetails.id });

      if (!event) {
        throw new createHttpError(404, "Event not found");
      }

      // UPDATE THE IMAGE FILE AND IMAGE FILENAME
      if (imageFile) {
        // REMOVE THE PREVIOUS IMAGE IF FILENAME IS NOT "DefaultEventImage"
        if (event.imageFilename != "DefaultEventImage") {
          console.log("Calling deleteImage function...");
          await ImageService.deleteImage(
            `images/${process.env.NODE_ENV}/event/${event.imageFilename}`
          );
        }

        const { title } = updatedDetails;
        const now = new Date();
        const titlePart = title.replace(/\s+/g, "-").toLowerCase();
        const datePart = now.toISOString().split("T")[0]; // Get the date part
        const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-");

        console.log("Calling uploadImage function...");
        const fileName = `${titlePart}-${datePart}-${timePart}`;

        await ImageService.uploadImage(
          imageFile.buffer,
          `images/${process.env.NODE_ENV}/event/${fileName}`
        );
        updatedDetails.imageFilename = fileName;
      }

      event.set(updatedDetails);
      await event.save();

      console.log("Event updated:", event);
      return event;
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(id, eventBody) {
    const event = await Event.findOneAndUpdate({ id }, eventBody, {
      new: true,
      useFindAndModify: false,
    });
    return event;
  }
}

module.exports = new EventsService();

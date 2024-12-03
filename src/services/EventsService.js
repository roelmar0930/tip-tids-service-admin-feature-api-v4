const Event = require("../models/Event");
const TeamMemberEvent = require("../models/TeamMemberEvent");
const ImageService = require("../services/ImageService");
const createHttpError = require("http-errors");

const TeamMemberService= require("../services/TeamMemberService");

class EventsService {
  async getAllEvents(query) {
    if (query && Object.keys(query).length === 1 && query.id) {
      return Event.findOne(query);
    }
  
    return Event.find(query);
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

  async inviteTeamMember(query, eventBody) {
    try {
      const event = await Event.findOne({ id: query.eventId });

      if (!event) {
        throw new createHttpError(409, "Event not found");
      }

      const eventExistInTeamMember = await TeamMemberEvent.findOne({
        eventId: event.id,
        teamMemberWorkdayId: eventBody.teamMemberWorkdayId,
        teamMemberEmail: eventBody.teamMemberEmail,
      });

      if (eventExistInTeamMember) {
        throw new createHttpError(
          409,
          "Team member already has this event assigned"
        );
      }

      const teamMemberEvent = new TeamMemberEvent({
        ...eventBody,
        eventId: event.id,
      });

      await teamMemberEvent.save();
      console.log("Team member event created:", teamMemberEvent);

      return teamMemberEvent;
    } catch (error) {
      throw error;
    }
  }

  async updateInvitedTeamMember(query, eventBody) {
    try {
      const event = await Event.findOne({ id: query.eventId });

      if (!event) {
        throw new createHttpError(409, "Event not found");
      }

      const teamMemberEvent = await TeamMemberEvent.findOne({
        eventId: event.id,
        ...query,
      });

      if (!teamMemberEvent) {
        throw new createHttpError(409, "Team member event not found");
      }

      teamMemberEvent.set(eventBody);

      await teamMemberEvent.save();
      console.log("Team member event updated:", teamMemberEvent);

      return teamMemberEvent;
    } catch (error) {
      throw error;
    }
  }

  async invitedTeamMembers(query) {
    try {
      const { eventDetailsInd, teamMemberDetails, ...queryWithoutEventDetailsInd } = query;
  
      // Fetch all team member events based on the query
      const teamMemberEvents = await TeamMemberEvent.find(queryWithoutEventDetailsInd);
  
      // Exit early if no team member events are found
      if (!teamMemberEvents.length) {
        return [];
      }
  
      // Fetch and clean up event details
      const events = await Promise.all(
        teamMemberEvents.map(async (teamMemberEvent) => {
          try {
            // Fetch event details only if eventDetailsInd is 'true'
            const event = 
              eventDetailsInd === 'true'
                ? await this.getAllEvents({ id: teamMemberEvent.eventId })
                : null;
  
            // Fetch team member details only if teamMemberDetails is 'true'
            const teamMember =
              teamMemberDetails === 'true'
                ? await TeamMemberService.getTeamMember({
                    workdayId: teamMemberEvent.teamMemberWorkdayId,
                  })
                : null;
  
            // Ensure event data is valid
            if (!event && eventDetailsInd === 'true') {
              console.warn(`Event not found for ID: ${teamMemberEvent.eventId}`);
              return null; // Skip processing if event is missing and eventDetailsInd is true
            }
  
            const { status, ...eventWithoutStatus } = event ? event._doc : {};
  
            // Construct the cleaned event object
            const cleanedEvent = {
              ...teamMemberEvent._doc,
              ...(eventDetailsInd === 'true' && { ...eventWithoutStatus }), // Include event details without 'status'
              ...(teamMember && teamMemberDetails === 'true' && { ...teamMember._doc }), // Include team member details if available
              eventStatus: event ? event.status : null, // Always include event status if event exists
            };
  
            return cleanedEvent;
          } catch (innerError) {
            console.error(
              `Error processing team member event ID: ${teamMemberEvent._id}`,
              innerError
            );
            return null; // Return null for individual errors but continue processing
          }
        })
      );
  
      // Filter out any null values from failed individual fetches
      return events.filter(Boolean);
    } catch (error) {
      console.error('Error fetching invited team members:', error);
      throw error; // Re-throw to let the caller handle the error
    }
  }
  
}
  


module.exports = new EventsService();

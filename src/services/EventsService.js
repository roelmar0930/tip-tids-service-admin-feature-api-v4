const Event = require("../models/Event");
const TeamMemberEvent = require("../models/TeamMemberEvent");
const ImageService = require("../services/ImageService");
const createHttpError = require("http-errors");
const logger = require("../utils/Logger");

const TeamMemberService= require("../services/TeamMemberService");
const TeamMember = require("../models/TeamMember");

class EventsService {
  async getAllEvents(query = {}) {
    try {
      const allowedFilters = ['status', 'category', 'isArchived', 'isCompleted'];
      const filter = {};
      
      // Only apply allowed filters if they exist in query
      allowedFilters.forEach(key => {
        if (query[key] !== undefined) {
          filter[key] = query[key];
        }
      });

      const events = await Event.find(filter);
      return events;
    } catch (error) {
      logger.error("Error fetching events: " + error.message);
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
      logger.info("Event created:", event);
      console.log("Event created:", event);
      return event;
    } catch (error) {
      logger.error("Error creating event:" + error.message);
      console.log("Error creating event:", error.message);
      throw error;
    }
  }

  async updateEvent(updatedDetails, imageFile) {
    try {
      const event = await Event.findOne({ id: updatedDetails.id });

      if (!event) {
        logger.error("404 Event not found");
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

  async bulkInviteTeamMemberEvent(id) {
    try {
      const teamMembers = await TeamMember.find({});
      const existingInvites = await TeamMemberEvent.find({ eventId: id });
      
      const existingInviteSet = new Set(
        existingInvites.map(invite => `${invite.teamMemberWorkdayId}-${invite.email}`)
      );

      let newTeamMemberEvents = [];

      for (const member of teamMembers) {
        const key = `${member.workdayId}-${member.workEmailAddress}`;
        if (!existingInviteSet.has(key)) {
          newTeamMemberEvents.push({
            eventId: id,
            teamMemberWorkdayId: member.workdayId,
            teamMemberEmail: member.email
          });
        }
      }

      if (newTeamMemberEvents.length > 0) {
        await TeamMemberEvent.insertMany(newTeamMemberEvents);
        logger.info(`Bulk invited ${newTeamMemberEvents.length} new team members to event ${id}`);
      } else {
        logger.info(`No new team members to invite for event ${id}`);
      }

      return newTeamMemberEvents.length;
    } catch (error) {
      logger.error(`Error in bulkInviteTeamMemberEvent: ${error.message}`);
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
        logger.error("409 Team member already has this event assigned");
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
      logger.info("Team member event created:" + teamMemberEvent);
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
        logger.error("409 Event not found");
        throw new createHttpError(409, "Event not found");
      }

      const teamMemberEvent = await TeamMemberEvent.findOne({
        eventId: event.id,
        ...query,
      });

      if (!teamMemberEvent) {
        logger.error("409 Team member event not found");
        throw new createHttpError(409, "Team member event not found");
      }

      teamMemberEvent.set(eventBody);

      await teamMemberEvent.save();
      logger.info("Team member event updated:" + teamMemberEvent);
      console.log("Team member event updated:", teamMemberEvent);

      return teamMemberEvent;
    } catch (error) {
      throw error;
    }
  }

  async getTeamMemberEvent(query) {
    try {
      // Fetch team member events based on query
      const teamMemberEvents = await TeamMemberEvent.find(query || {});
  
      // Exit early if no team member events are found
      if (!teamMemberEvents.length) {
        return {
          teamMemberDetails: {},
          unregisteredEvents: [],
          registeredEvents: []
        };
      }
  
      // Get unique workday IDs from team member events
      const workdayIds = [...new Set(teamMemberEvents.map(event => event.teamMemberWorkdayId))];
      
      // Fetch team member details for the first workday ID
      const teamMember = workdayIds.length > 0 
        ? await TeamMemberService.getTeamMember({ workdayId: workdayIds[0] })
        : null;

      // Separate TeamMemberEvents into registered and unregistered
      const registeredTeamMemberEvents = teamMemberEvents.filter(event => event.status === 'registered');
      const unregisteredTeamMemberEvents = teamMemberEvents.filter(event => event.status === 'unregistered');

      // Fetch events for registered and unregistered TeamMemberEvents
      const fetchEvents = async (teamMemberEvents) => {
        return Promise.all(
          teamMemberEvents.map(async (teamMemberEvent) => {
            const event = await Event.findOne({ id: teamMemberEvent.eventId });
            if (event) {
              return {
                eventDetails: event._doc,
                additionalInfo: {
                  isSurveyDone: teamMemberEvent.isSurveyDone || false,
                  address: teamMemberEvent.address || "",
                  invitedDate: teamMemberEvent.invitedDate || "",
                  isPointsAwarded: teamMemberEvent.isPointsAwarded || false,
                  status: teamMemberEvent.status || "unregistered"
                }
              };
            }
            return null;
          })
        );
      };

      const registeredEvents = await fetchEvents(registeredTeamMemberEvents);
      const unregisteredEvents = await fetchEvents(unregisteredTeamMemberEvents);

      // Filter out null events and return the result
      return {
        teamMemberDetails: teamMember ? teamMember._doc : {},
        unregisteredEvents: unregisteredEvents.filter(Boolean),
        registeredEvents: registeredEvents.filter(Boolean)
      };
    } catch (error) {
      logger.error('Error fetching invited team members:' + error);
      console.error('Error fetching invited team members:', error);
      throw error; // Re-throw to let the caller handle the error
    }
  }

  async getEventDetails(id) {
    try {
      const event = await Event.findById(id);
      if (!event) {
        throw new createHttpError(404, "Event not found");
      }
      return event;
    } catch (error) {
      logger.error("Error fetching event details: " + error.message);
      throw error;
    }
  }
  
}

module.exports = new EventsService();

const schedule = require("node-schedule");
const Event = require("../models/Event");
const addPointsForCompletedEvent = require("./addPointsForCompletedEvent");
const {
  formatDateToManilaUTC,
  formatDateToUTC,
} = require("../utils/DateUtils");
const logger = require("../utils/Logger");

// Main scheduled job function
module.exports = function ScheduleJobs() {
  // Schedule to mark outdated events as completed
  schedule.scheduleJob("*/1 * * * *", async () => {
    const now = new Date();
    try {
      const outdatedEvents = await getOutdatedEvents(now);

      for (const event of outdatedEvents) {
        if (isEventCompleted(event, now)) {
          event.isCompleted = true;
          await event.save();
          logger.info(`Event ID ${event.id} is marked as completed`);
        }
      }

      await awardPointsForCompletedEvents();
      logger.info(`Points awarded for completed events`);
    } catch (error) {
      logger.error(`Failed to run the scheduled job: ${error.message}`);
    }
  });
};

// Function to fetch outdated events, excluding archived ones
async function getOutdatedEvents(now) {
  return Event.find({
    endDate: { $lt: formatDateToManilaUTC(now) },
    isCompleted: false,
    isArchived: false,
  });
}

// Helper to check if an event is ready to be marked as completed
function isEventCompleted(event, now) {
  const eventEndDateUTC = formatDateToUTC(new Date(event.endDate));
  const endDateWithBuffer = new Date(eventEndDateUTC);
  endDateWithBuffer.setHours(endDateWithBuffer.getHours() + 12);
  return endDateWithBuffer <= now;
}

// Function to add points for all completed events with "Active" status
async function awardPointsForCompletedEvents() {
  const completedActiveEvents = await Event.find({
    isCompleted: true,
    status: "active",
  });

  for (const event of completedActiveEvents) {
    await addPointsForCompletedEvent(event.id);
  }
}

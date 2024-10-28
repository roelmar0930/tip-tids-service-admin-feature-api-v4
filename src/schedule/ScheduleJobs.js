const schedule = require("node-schedule");
const Event = require("../models/Event");
const addPointsForCompletedEvent = require("./addPointsForCompletedEvent");
const {
  formatDateToManilaUTC,
  formatDateToUTC,
} = require("../utils/DateUtils");

// Main scheduled job function
module.exports = function ScheduleJobs() {
  // Schedule to mark outdated events as completed
  schedule.scheduleJob("*/5 * * * *", async () => {
    const now = new Date();
    try {
      const outdatedEvents = await getOutdatedEvents(now);

      for (const event of outdatedEvents) {
        if (isEventCompleted(event, now)) {
          event.isCompleted = true;
          await event.save();
          console.log(`Event ID ${event.id} is marked as completed.`);
        }
      }

      // Separate function to add points for all completed, active events
      await awardPointsForCompletedEvents();
    } catch (error) {
      console.error("Failed to run the scheduled job:", error);
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
    console.log(`Points awarded for completed active event ID: ${event.id}`);
  }
}

// const schedule = require("node-schedule");
// const Event = require("../models/Event");
// const Registration = require("../models/Registration");
// const TeamMemberPointsService = require("../services/TeamMemberPointsService");
// const EventsService = require("../services/EventsService");
// const {
//   formatDateToManilaUTC,
//   formatDateToUTC,
// } = require("../utils/DateUtils");

// // Function to add points for completed events
// async function addPointsForCompletedEvent(id) {
//   try {
//     // Retrieve the event details using id
//     const event = await EventsService.getEventDetails(id);
//     const registrations = await Registration.find({
//       id,
//       pointsAwarded: false,
//     });
//     const { category, pointsNum: points } = event[0];

//     if (!event) {
//       console.error(`Event details not found for event ID: ${id}`);
//       return; // Exit if event not found
//     }

//     if (registrations.length === 0) {
//       console.log(`No registrations found`);
//       return;
//     }

//     for (const registration of registrations) {
//       // Add points to the user's record
//       await TeamMemberPointsService.addPoints(
//         registration.email,
//         points,
//         category
//       );

//       // Mark points as awarded in registration
//       registration.pointsAwarded = true;
//       await registration.save();

//       console.log(`Points awarded and saved for ${registration.email}`);
//     }
//   } catch (error) {
//     console.error(`Failed to process event ${id}:`, error);
//   }
// }

// // Scheduled job
// module.exports = function ScheduleJobs() {
//   schedule.scheduleJob("*/1 * * * *", async () => {
//     const now = new Date();
//     const outdatedEvents = await Event.find({
//       endDate: { $lt: formatDateToManilaUTC(now) },
//       status: { $nin: ["Completed", "Archived"] },
//     });

//     for (const event of outdatedEvents) {
//       const eventEndDate = new Date(event.endDate); // Create a new Date object for manipulation
//       const eventEndDateUTC = formatDateToUTC(eventEndDate);
//       const endDateWithBuffer = new Date(eventEndDateUTC);
//       endDateWithBuffer.setHours(endDateWithBuffer.getHours() + 12);

//       if (endDateWithBuffer <= now) {
//         event.status = "Completed";
//         await event.save();
//         console.log("Event ID " + event.id + " is Completed");

//         // Add points to users for this event
//         await addPointsForCompletedEvent(event.id);
//       }
//     }
//   });
// };

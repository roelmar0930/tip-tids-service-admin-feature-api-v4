const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/EventsController");
const upload = require("../middleware/UploadMiddleware");

router.get("/getAllEvents", eventsController.getAllEvents);

router.post("/getEventDetailsByDate", eventsController.getEventDetailsByDate);

router.get("/getEventDetails/:eventId", eventsController.getEventDetails);

router.post("/register", eventsController.register);

router.get(
  "/getUnregisteredEvents/:email",
  eventsController.getUnregisteredEvents
);

router.get("/getRegisteredEvents/:email", eventsController.getRegisteredEvents);

router.post(
  "/createEvent",
  upload.single("imgfile"),
  eventsController.createEvent
);

router.patch(
  "/updateEvent/:eventId",
  upload.single("imageFile"),
  eventsController.updateEvent
);

router.put("/deleteEvent/:eventId", eventsController.deleteEvent);

module.exports = router;

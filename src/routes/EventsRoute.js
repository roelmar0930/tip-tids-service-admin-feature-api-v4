const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/EventsController");
const upload = require("../middleware/UploadMiddleware");
const {
  validateGetEventDetails,
  validateGetAllEvents,
} = require("../middleware/validator/EventValidator");

router.get(
  "/getAllEvents",
  validateGetAllEvents,
  eventsController.getAllEvents
);

router.get(
  "/getEventDetails",
  validateGetEventDetails,
  eventsController.getEventDetails
);

router.post(
  "/createEvent",
  upload.single("imageFile"),
  eventsController.createEvent
);

router.patch(
  "/updateEvent",
  upload.single("imageFile"),
  eventsController.updateEvent
);

router.put("/deleteEvent/:", eventsController.deleteEvent);

module.exports = router;

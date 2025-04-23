const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/EventsController");
const jwtAuthenticator = require('../utils/JWTAuthenticator');
const upload = require("../middleware/UploadMiddleware");
const {
  validateGetEventDetails,
  validateGetAllEvents,
  validateInvitedTeamMembersQuery
} = require("../middleware/validator/EventValidator");

router.get(
  "/",
  validateGetAllEvents,
  eventsController.getAllEvents
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

router.put("/deleteEvent/:id", eventsController.deleteEvent);

router.post("/inviteTeamMember", eventsController.inviteTeamMember);

router.patch("/updateInvitedTeamMember", eventsController.updateInviteTeamMember);

router.get(
  "/teamMemberEvent",
  validateInvitedTeamMembersQuery,
  eventsController.getTeamMemberEvent
);

router.get(
  "/eventDetails/:id",
  validateGetEventDetails,
  eventsController.getEventDetails
);

module.exports = router;

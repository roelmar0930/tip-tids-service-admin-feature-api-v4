const express = require("express");
const router = express.Router();
const TeamMemberController = require("../controllers/TeamMemberController");
const TeamMemberPointsController = require("../controllers/TeamMemberPointsController");

const {
  validateGetTeamMemberEventsQuery,
  validateGetAllTeamMemberEventsQuery,
} = require("../middleware/validator/TeamMemberValidator");

router.get("/getAllTeamMember", TeamMemberController.getAllTeamMember);

router.get("/getTeamMember", TeamMemberController.getTeamMember);

router.post("/addEvent", TeamMemberController.addEvent);

router.patch("/updateEvent", TeamMemberController.updateEvent);

router.get("/getPoints", TeamMemberPointsController.getTeamMemberPoints);

router.get(
  "/getEvents",
  validateGetTeamMemberEventsQuery,
  TeamMemberController.getEvents
);

router.get(
  "/getAllEventDetails",
  validateGetAllTeamMemberEventsQuery,
  TeamMemberController.getAllEventDetails
);

module.exports = router;

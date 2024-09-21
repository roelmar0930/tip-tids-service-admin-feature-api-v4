const express = require("express");
const router = express.Router();
const TeamMemberController = require("../controllers/TeamMemberController");
const {
  validateGetTeamMemberEventsQuery,
  validateGetAllTeamMemberEventsQuery,
} = require("../middleware/validator/TeamMemberValidator");

router.get("/getAllTeamMember", TeamMemberController.getAllTeamMember);

router.get(
  "/getTeamMemberInfoByEmail/:workEmailAddress",
  TeamMemberController.getTeamMemberInfoByEmail
);

router.get(
  "/getTeamMemberInfoByWorkorderId/:workdayId",
  TeamMemberController.getTeamMemberInfoByWorkorderId
);

router.get(
  "/getTeamMemberListByManager/:immediateManagerWorkorderId",
  TeamMemberController.getTeamMemberListByManager
);

router.post("/addEvent", TeamMemberController.addEvent);

router.post("/updateEvent", TeamMemberController.updateEvent);

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

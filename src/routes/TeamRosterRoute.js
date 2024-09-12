const express = require("express");
const TeamRosterController = require("../controllers/TeamRosterController");
const router = express.Router();

router.get("/getAllTeamMember", TeamRosterController.getAllTeamMember);

router.get(
  "/getTeamMemberInfoByEmail/:workEmailAddress",
  TeamRosterController.getTeamMemberInfoByEmail
);

router.get(
  "/getTeamMemberInfoByWorkorderId/:workorderId",
  TeamRosterController.getTeamMemberInfoByWorkorderId
);

router.get(
  "/getTeamMemberListByManager/:immediateManagerWorkorderId",
  TeamRosterController.getTeamMemberListByManager
);

module.exports = router;

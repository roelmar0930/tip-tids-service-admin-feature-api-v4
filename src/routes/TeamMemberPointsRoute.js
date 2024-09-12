const express = require("express");
const router = express.Router();
const TeamMemberPointsController = require("../controllers/TeamMemberPointsController");

router.get(
  "/getTeamMemberPointsByEmail/:email",
  TeamMemberPointsController.getTeamMemberPointsByEmail
);
router.post("/addPoints", TeamMemberPointsController.addPoints);

module.exports = router;

const express = require("express");
const router = express.Router();
const teamMemberController = require("../controllers/TeamMemberController");

router.get(
  "/getTeamMemberInfoByName/:employeeName",
  teamMemberController.getTeamMemberInfoByName
);
router.post("/addStarPoints", teamMemberController.addStarPoints);
router.get(
  "/checkDuplicates/:email/:eventId",
  teamMemberController.checkDuplicates
);

module.exports = router;

const express = require("express");
const router = express.Router();
const overviewController = require("../controllers/OverviewController");

router.get("/", function (req, res, next) {
  res.render("overview", { title: "Overview API" });
});

router.get(
  "/getUpcomingEventsCount",
  overviewController.getUpcomingEventsCount
);

router.get(
  "/getPendingTasksCount/:email",
  overviewController.getPendingTasksCount
);

router.get("/getTasksById/:id", overviewController.getTasksById);

router.post("/addTask", overviewController.addTask);

router.get("/getEvents", overviewController.getEvents);

router.get("/getTasks/:email", overviewController.getTasks);

router.get(
  "/getTeamMemberInfoById/:id",
  overviewController.getTeamMemberInfoById
);

module.exports = router;

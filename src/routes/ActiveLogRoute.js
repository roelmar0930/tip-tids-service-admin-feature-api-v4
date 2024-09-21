const express = require("express");
const router = express.Router();
const ActiveLogController = require("../controllers/ActiveLogController");

// Route to create a new activity log
router.post("/createActiveLog", ActiveLogController.createLog);

// Route to get all logs
router.get("/getAllActivelog", ActiveLogController.getAllLogs);

// Route to get logs by resource
router.get(
  "/activelog/resource/:resource",
  ActiveLogController.getLogsByResource
);

// Route to get logs by author email
router.get(
  "/activelog/author/:email",
  ActiveLogController.getLogsByAuthorEmail
);

module.exports = router;

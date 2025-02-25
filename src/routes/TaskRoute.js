const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");
const jwtAuthenticator = require('../utils/JWTAuthenticator');
const {
  validateGetAllTasks,
} = require("../middleware/validator/TaskValidator");

router.post(
    "/",
    taskController.getTasks
);

router.post("/createTask", taskController.createTask);

router.patch("/updateTask", taskController.updateTask);

router.post("/assignTask", taskController.assignTask);

router.patch("/updateAssignedTask", taskController.updateAssignedTask);

router.post("/assignedTask", taskController.getAssignedTaskWithFilter);

router.put("/deleteTask/:taskId", taskController.deleteTask);

router.get("/getAssignedTaskDetails", taskController.getAssignedTaskDetails);

module.exports = router;

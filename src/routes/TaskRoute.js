const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");
const {
  validateGetTaskDetails,
  validateGetAllTasks,
} = require("../middleware/validator/TaskValidator");

router.get(
    "/getAllTasks", 
    validateGetAllTasks, 
    taskController.getAllTasks
);

router.get(
  "/getTaskDetails",
  validateGetTaskDetails,
  taskController.getTaskDetails
);

router.post("/createTask", taskController.createTask);

router.patch("/updateTask", taskController.updateTask);

router.put("/deleteTask/:taskId", taskController.deleteTask);

module.exports = router;

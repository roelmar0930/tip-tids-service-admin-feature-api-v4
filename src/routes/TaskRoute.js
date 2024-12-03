const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");
const {
  validateGetAllTasks,
} = require("../middleware/validator/TaskValidator");

router.get(
    "/", 
    validateGetAllTasks, 
    taskController.getAllTasks
);

router.post("/createTask", taskController.createTask);

router.patch("/updateTask", taskController.updateTask);

router.put("/deleteTask/:taskId", taskController.deleteTask);

module.exports = router;

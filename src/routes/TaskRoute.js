const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");

router.post("/addTask", taskController.addTask);

router.get("/getAllTasks", taskController.getAllTasks);

router.post("/completeTask/:taskId/:email", taskController.completeTask);

router.put("/updateTaskById/:taskId", taskController.udpateTaskById);

router.get("/getCompletedTasks/:email", taskController.getCompletedTasks);

router.get("/getIncompleteTasks/:email", taskController.getIncompleteTasks);

router.put("/deleteTask/:taskId", taskController.deleteTask);

module.exports = router;

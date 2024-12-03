const TaskService = require("../services/TaskService");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getAllTasks(req.query);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const taskBody = req.body;

    const task = await TaskService.createTask(taskBody);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await TaskService.updateTask(req.body);
    res.status(200).send(task);
  } catch (error) {
    next(error);
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await TaskService.deleteTask(req.params.taskId, req.body);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};

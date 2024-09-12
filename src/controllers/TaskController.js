const Task = require("../models/Task");
const TaskService = require("../services/TaskService");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const addTask = async (req, res) => {
  try {
    const task = await TaskService.addTask(req.body);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const completeTask = async (req, res) => {
  try {
    const completedTask = await TaskService.completeTask(
      req.params.taskId,
      req.params.email
    );
    res.status(200).json(completedTask);
  } catch (error) {
    next(error);
  }
};

const udpateTaskById = async (req, res) => {
  try {
    const task = await TaskService.updateTaskById(req.params.taskId, req.body);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const getCompletedTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getCompletedTasks(req.params.email);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getIncompleteTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getIncompleteTasks(req.params.email);
    res.status(200).json(tasks);
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
  addTask,
  getAllTasks,
  completeTask,
  udpateTaskById,
  getCompletedTasks,
  getIncompleteTasks,
  deleteTask,
};

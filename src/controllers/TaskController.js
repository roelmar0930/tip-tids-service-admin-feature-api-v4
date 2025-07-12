const TaskService = require("../services/TaskService");

/**
 * Controller for fetching tasks based on filters or returning all tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTasks = async (req, res) => {
  try {
    const filters = req.body || {}; // Accept filters or default to an empty object

    const tasks = await TaskService.getTasksByFilters(filters, req.timeZone);

    res.status(200).json(tasks);
  } catch (error) {
    logger.error(`Error in getTasks: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createTask = async (req, res, next) => {
  try {
    const taskBody = req.body;

    const task = await TaskService.createTask(taskBody, req.timeZone);
    await TaskService.bulkAssignTeamMemberTask(task.id);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await TaskService.updateTask(req.body, req.timeZone);
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

const assignTask = async (req, res, next) => {
  try {
    const teamMemberTask = await TaskService.assignTask(      
      req.query,
      req.body
    );
    res.status(200).json(teamMemberTask);
  } catch (error) {
    next(error);
  }
};

const updateAssignedTask = async (req, res, next) => {
  try {
    const teamMemberTask = await TaskService.updateAssignedTask(
      req.query,
      req.body
    );
    res.status(200).json(teamMemberTask);
  } catch (error) {
    next(error);
  }
};

const getAssignedTaskWithFilter = async (req, res, next) => {
  try {
    const filters = req.body || {}; 

    const tasks = await TaskService.getAssignedTasksByFilters(filters, req.timeZone);

    res.status(200).json(tasks);
  } catch (error) {
    logger.error(`Error in getAssignedTask: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAssignedTaskDetails = async (req, res) => {
  try {
    const query = {
      teamMemberEmail: req.query.teamMemberEmail,
      teamMemberWorkdayId: req.query.teamMemberWorkdayId
    };
    const taskDetails = await TaskService.getAssignedTaskDetails(query, req.timeZone);
    res.status(200).json(taskDetails);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask,
  updateAssignedTask,
  getAssignedTaskWithFilter,
  getAssignedTaskDetails
};

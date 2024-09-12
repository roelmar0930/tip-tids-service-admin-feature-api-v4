const OverviewService = require("../services/OverviewService");

const getUpcomingEventsCount = async (req, res) => {
  try {
    const eventsCount = await OverviewService.getUpcomingEventsCount();
    res.status(200).json(eventsCount);
  } catch (error) {
    next(error);
  }
};

const getPendingTasksCount = async (req, res) => {
  try {
    const tasksCount = await OverviewService.getPendingTasksCount(
      req.params.email
    );
    return res.status(200).json(tasksCount);
  } catch (error) {
    next(error);
  }
};

const getTasksById = async (req, res) => {
  try {
    const tasks = await OverviewService.getTasksById(req.params.id);
    return res.send(tasks);
  } catch (error) {
    next(error);
  }
};

const addTask = async (req, res) => {
  try {
    const task = await OverviewService.addTask(req.body);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res) => {
  try {
    const event = await OverviewService.getEvents();
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res) => {
  try {
    const task = await OverviewService.getTasks(req.params.email);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const getTeamMemberInfoById = async (req, res) => {
  const teamMember = await OverviewService.getTeamMemberInfoById(req.params.id);
  if (teamMember.length > 0) {
    return res.send(teamMember);
  }
  res.status(404).json({ message: "Id not found" });
};

module.exports = {
  getUpcomingEventsCount,
  getPendingTasksCount,
  getTasksById,
  addTask,
  getEvents,
  getTasks,
  getTeamMemberInfoById,
};

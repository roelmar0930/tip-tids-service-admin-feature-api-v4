const ActiveLogService = require("../services/ActiveLogService");

// Create a new activity log
exports.createLog = async (req, res, next) => {
  try {
    const logData = req.body;
    const log = await ActiveLogService.createLog(logData);
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

// Get all activity logs
exports.getAllLogs = async (req, res, next) => {
  try {
    const logs = await ActiveLogService.getAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

// Get logs by resource
exports.getLogsByResource = async (req, res, next) => {
  try {
    const resource = req.params.resource;
    const logs = await ActiveLogService.getLogsByResource(resource);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

// Get logs by author email
exports.getLogsByAuthorEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    const logs = await ActiveLogService.getLogsByAuthorEmail(email);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

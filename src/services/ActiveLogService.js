const ActiveLog = require("../models/ActiveLog");
const createHttpError = require("http-errors");

class ActiveLogService {
  // Create a new activity log
  async createLog(logData) {
    try {
      const log = new ActiveLog(logData);
      await log.save();
      return log;
    } catch (error) {
      throw createHttpError(500, "Error creating log: " + error.message);
    }
  }

  // Get all activity logs
  async getAllLogs() {
    try {
      const logs = await ActiveLog.find().sort({ timestamp: -1 });
      return logs;
    } catch (error) {
      throw createHttpError(500, "Error fetching logs: " + error.message);
    }
  }

  // Get logs by resource (e.g., 'User', 'Event')
  async getLogsByResource(resource) {
    try {
      const logs = await ActiveLog.find({ resource }).sort({ timestamp: -1 });
      return logs;
    } catch (error) {
      throw createHttpError(500, "Error fetching logs: " + error.message);
    }
  }

  // Get logs by author email
  async getLogsByAuthorEmail(email) {
    try {
      const logs = await ActiveLog.find({ "author.email": email }).sort({
        timestamp: -1,
      });
      return logs;
    } catch (error) {
      throw createHttpError(500, "Error fetching logs: " + error.message);
    }
  }
}

module.exports = new ActiveLogService();

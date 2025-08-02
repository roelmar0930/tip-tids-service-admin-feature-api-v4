const ReportService = require('../services/ReportService');
const logger = require('../utils/Logger');

class ReportController {
  static async getComplianceReport(req, res, next) {
    try {
      const { eventId } = req.query;
      const report = await ReportService.getComplianceReport(eventId);
      res.json(report);
    } catch (error) {
      logger.error(`Error in getComplianceReport: ${error.message}`);
      next(error);
    }
  }

  static async getEventInvitedTeamMembers(req, res, next) {
    try {
      const { id } = req.params;
      const report = await ReportService.getEventInvitedTeamMembers(id);
      res.json(report);
    } catch (error) {
      logger.error(`Error in getEventInvitedTeamMembers: ${error.message}`);
      next(error);
    }
  }

  static async getTaskAssignedTeamMembers(req, res, next) {
    try {
      const { id } = req.params;
      const report = await ReportService.getTaskAssignedTeamMembers(id);
      res.json(report);
    } catch (error) {
      logger.error(`Error in getTaskAssignedTeamMembers: ${error.message}`);
      next(error);
    }
  }  

  static async getEventReport(req, res, next) {
    try {
      const report = await ReportService.getEventReport();
      res.json(report);
    } catch (error) {
      logger.error(`Error in getEventReport: ${error.message}`);
      next(error);
    }
  }

  static async getEventReportWithDetails(req, res, next) {
    try {
      const report = await ReportService.getEventReportWithDetails(req.timeZone);
      res.json(report);
    } catch (error) {
      logger.error(`Error in getEventReportWithDetails: ${error.message}`);
      next(error);
    }
  }

  static async getTaskReportWithDetails(req, res, next) {
    try {
      const report = await ReportService.getTaskReportWithDetails(req.timeZone);
      res.json(report);
    } catch (error) {
      logger.error(`Error in getTaskReport: ${error.message}`);
      next(error);
    }
  }
}

module.exports = ReportController;

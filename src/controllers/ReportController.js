const ReportService = require('../services/ReportService');

class ReportController {
  static async getComplianceReport(req, res, next) {
    try {
      const { eventId } = req.query;
      const report = await ReportService.getComplianceReport(eventId);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  static async getEventInvitedTeamMembers(req, res, next) {
    try {
      const { id } = req.params;
      const report = await ReportService.getEventInvitedTeamMembers(id);
      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  static async getEventReport(req, res, next) {
    try {
      const report = await ReportService.getEventReport();
      res.json(report);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;

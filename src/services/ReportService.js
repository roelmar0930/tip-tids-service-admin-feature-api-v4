const Event = require('../models/Event');
const Task = require('../models/Task');
const TeamMemberEvent = require('../models/TeamMemberEvent');
const TeamMemberTask = require('../models/TeamMemberTask');
const TeamMember = require('../models/TeamMember');
const { convertToTimezone } = require('../utils/DateUtils');



class ReportService {
  static async getComplianceReport(eventId) {
    try {
      if (eventId) {
        return await this.getEventComplianceReport(eventId);
      } else {
        return await this.getAllEventsComplianceReport();
      }
    } catch (error) {
      throw new Error('Failed to generate compliance report: ' + error.message);
    }
  }

  static async getAllEventsComplianceReport() {
    try {
      const events = await Event.find().lean();
      const teamMemberEvents = await TeamMemberEvent.find().lean();

      const totalInvitesSent = teamMemberEvents.length;
      const totalRegistered = teamMemberEvents.filter(tme => tme.status === 'registered').length;
      const totalUnregistered = totalInvitesSent - totalRegistered;
      const overallCompliancePercentage = (totalRegistered / totalInvitesSent) * 100;

      let totalTargetCompliance = 0;
      const eventReports = await Promise.all(events.map(async (event) => {
        const eventTeamMemberEvents = teamMemberEvents.filter(tme => tme.eventId.toString() === event.id.toString());
        const eventTotalInvitesSent = eventTeamMemberEvents.length;
        const eventTotalRegistered = eventTeamMemberEvents.filter(tme => tme.status === 'registered').length;
        const eventCompliancePercentage = (eventTotalRegistered / eventTotalInvitesSent) * 100;

        totalTargetCompliance += event.targetCompliance;

        return {
          eventId: event._id,
          eventName: event.title,
          targetCompliance: event.targetCompliance,
          actualCompliancePercentage: eventCompliancePercentage,
          complianceStatus: eventCompliancePercentage >= event.targetCompliance ? 'Met' : 'Not Met'
        };
      }));

      const averageTargetCompliance = totalTargetCompliance / events.length;

      return {
        totalEvents: events.length,
        totalInvitesSent,
        overallAttendees: totalRegistered,
        complianceBreakdown: {
          registered: totalRegistered,
          unregistered: totalUnregistered
        },
        overallCompliancePercentage,
        averageTargetCompliance,
        eventReports,
        complianceStatus: overallCompliancePercentage >= averageTargetCompliance ? 'Met' : 'Not Met'
      };
    } catch (error) {
      throw new Error('Failed to generate all events compliance report: ' + error.message);
    }
  }

  static async getEventComplianceReport(eventId) {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      const teamMemberEvents = await TeamMemberEvent.find({ eventId: event.id }).lean();

      const totalInvitesSent = teamMemberEvents.length;
      const totalRegistered = teamMemberEvents.filter(tme => tme.status === 'registered').length;
      const totalUnregistered = totalInvitesSent - totalRegistered;
      const actualCompliancePercentage = totalInvitesSent > 0 ? (totalRegistered / totalInvitesSent) * 100 : 0;
      
      return {
        eventId: event._id,
        eventName: event.title,
        totalInvitesSent,
        overallAttendees: totalRegistered,
        complianceBreakdown: {
          registered: totalRegistered,
          unregistered: totalUnregistered
        },
        targetCompliance: event.targetCompliance,
        actualCompliancePercentage,
        complianceStatus: actualCompliancePercentage >= event.targetCompliance ? 'Met' : 'Not Met'
      };
    } catch (error) {
      throw new Error('Failed to generate event compliance report: ' + error.message);
    }
  }

  static async getEventInvitedTeamMembers(eventId) {
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      const teamMemberEvents = await TeamMemberEvent.find({ eventId: event.id }).lean();
      const teamMemberIds = teamMemberEvents.map(tme => tme.teamMemberWorkdayId);
      const teamMemberEmail = teamMemberEvents.map(tme => tme.teamMemberEmail);
      const teamMembers = await TeamMember.find({ workdayId: { $in: teamMemberIds }, email: { $in: teamMemberEmail } }).lean();

      // Create a map of workdayId to team member event details
      const teamMemberEventMap = teamMemberEvents.reduce((map, tme) => {
        map[tme.teamMemberWorkdayId, tme.teamMemberEmail] = {
          status: tme.status,
          isPointsAwarded: tme.isPointsAwarded,
          isSurveyDone: tme.isSurveyDone,
          invitedDate: tme.invitedDate
        };
        return map;
      }, {});

      const report = {
        eventId: event._id,
        eventTitle: event.title,
        totalInvited: teamMembers.length,
        targetCompliance: event.targetCompliance,
        invitedTeamMembers: teamMembers.map(tm => ({
          workdayId: tm.workdayId,
          email: tm.email,
          fullName: tm.firstName + ' '  + tm.middleName + ' ' + tm.lastName + ' ' + (tm.suffix ? tm.suffix : ''),
          jobProfile: tm.jobProfile,
          functionalArea: tm.functionalArea,
          firstName: tm.firstName,
          lastName: tm.lastName,
          middleName: tm.middleName,
          suffix: tm.suffix,
          supervisorName: tm.supervisor.name,
          operationalManagerName: tm.operationalManager.name,
          eventStatus: teamMemberEventMap[tm.workdayId, tm.email].status,
          isPointsAwarded: teamMemberEventMap[tm.workdayId, tm.email].isPointsAwarded,
          isSurveyDone: teamMemberEventMap[tm.workdayId, tm.email].isSurveyDone,
          invitedDate: teamMemberEventMap[tm.workdayId, tm.email].invitedDate,
          tidsPractice: tm.practice,
        }))
      };

      return report;
    } catch (error) {
      throw new Error('Failed to generate event invited team members report: ' + error.message);
    }
  }

  static async getEventReport() {
    try {
      const events = await Event.find().lean();
      
      // Process events and generate report
      const report = {
        totalEvents: events.length,
        eventsByStatus: {},
        eventsByType: {}
      };

      events.forEach(event => {
        // Count events by status
        if (report.eventsByStatus[event.status]) {
          report.eventsByStatus[event.status]++;
        } else {
          report.eventsByStatus[event.status] = 1;
        }

        // Count events by type
        if (report.eventsByType[event.type]) {
          report.eventsByType[event.type]++;
        } else {
          report.eventsByType[event.type] = 1;
        }
      });

      return report;
    } catch (error) {
      throw new Error('Failed to generate event report: ' + error.message);
    }
  }

  static async getEventReportWithDetails(timezone = 'UTC') {
    try {
      const events = await Event.find().lean();
      const teamMemberEvents = await TeamMemberEvent.find().lean();

      // Calculate total events by category
      // Get all unique categories from events
      const categories = [...new Set(events.map(event => event.category))];
      // Count events per category dynamically
      const totalPerCategory = categories.reduce((acc, category) => {
        acc[category] = events.filter(event => event.category === category && !event.isArchived).length;
        return acc;
      }, {});

      const totalInvitedTeamMember = teamMemberEvents.length;

      // Transform events to match the required format with timezone conversion
      const listOfEvents = events.map(event => ({
        _id: event._id.toString(),
        id: event.id,
        title: event.title,
        category: event.category,
        createdDate: convertToTimezone(event.createdAt || new Date(), timezone),
        startDate: convertToTimezone(event.startDate, timezone),
        endDate: convertToTimezone(event.endDate, timezone),
        registeredTeamMembers: teamMemberEvents.filter(tme => tme.eventId.toString() === event.id.toString() && tme.status === 'registered').length,
        unregisteredTeamMembers: teamMemberEvents.filter(tme => tme.eventId.toString() === event.id.toString() && tme.status === 'unregistered').length,
      })).filter(event => !event.isArchived)

      return {
        totalEvents: events.filter(event => !event.isArchived).length,
        totalActiveEvents: events.filter(event => event.status === 'active' && !event.isCompleted && !event.isArchived).length,
        totalNotActiveEvents: events.filter(event => event.status === 'inactive' && !event.isCompleted && !event.isArchived).length,
        totalCompletedEvents: events.filter(event => event.isCompleted && !event.isArchived).length,
        
        totalPerCategory,
        totalInvitedTeamMember,
        listOfEvents
      };
    } catch (error) {
      throw new Error('Failed to generate event report with details: ' + error.message);
    }
  }

  static async getTaskReport() {
   try {
      const teamMemberTasks = await TeamMemberTask.find().lean();
      const archivedTasks = await Task.find({ isArchived: true }).lean();
      const excludedTaskIds = archivedTasks.map(task => task.id);

      return {
        totalTaskAssignment: teamMemberTasks.filter(teamMemberTasks => 
          !excludedTaskIds.includes(teamMemberTasks.taskId)).length,
        totalCompletedTasks: teamMemberTasks.filter(teamMemberTasks => teamMemberTasks.status === "completed" && 
          !excludedTaskIds.includes(teamMemberTasks.taskId)).length,
        totalInProgressTasks: teamMemberTasks.filter(teamMemberTasks => teamMemberTasks.status === "inProgress" && 
          !excludedTaskIds.includes(teamMemberTasks.taskId)).length,
        totalNotStartedTasks: teamMemberTasks.filter(teamMemberTasks => teamMemberTasks.status === "notStarted" &&
          !excludedTaskIds.includes(teamMemberTasks.taskId)).length,
      };
    } catch (error) {
      throw new Error('Failed to generate task report: ' + error.message);
    }
  }

}

module.exports = ReportService;

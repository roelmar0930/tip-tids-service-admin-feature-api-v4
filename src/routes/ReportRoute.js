const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Event and compliance reporting endpoints
 */

/**
 * @swagger
 * /report/event:
 *   get:
 *     summary: Get event report
 *     tags: [Reports]
 *     description: Retrieve a report of all events, including counts by status and type
 *     responses:
 *       200:
 *         description: Event report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEvents:
 *                   type: number
 *                   description: Total number of events
 *                 eventsByStatus:
 *                   type: object
 *                   description: Count of events grouped by status
 *                   additionalProperties:
 *                     type: number
 *                 eventsByType:
 *                   type: object
 *                   description: Count of events grouped by type
 *                   additionalProperties:
 *                     type: number
 *       500:
 *         description: Failed to generate event report
 */
router.get('/event', ReportController.getEventReport);

/**
 * @swagger
 * /report/event/{id}/invitedTeamMember:
 *   get:
 *     summary: Get invited team members for an event
 *     tags: [Reports]
 *     description: Retrieve a list of team members invited to a specific event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Invited team members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventId:
 *                   type: string
 *                   description: ID of the event
 *                 eventTitle:
 *                   type: string
 *                   description: Title of the event
 *                 totalInvited:
 *                   type: number
 *                   description: Total number of invited team members
 *                 invitedTeamMembers:
 *                   type: array
 *                   description: List of invited team members
 *                   items:
 *                     type: object
 *                     properties:
 *                       workdayId:
 *                         type: string
 *                         description: Team member's Workday ID
 *                       email:
 *                         type: string
 *                         description: Team member's email
 *                       fullName:
 *                         type: string
 *                         description: Team member's full name
 *                       jobProfile:
 *                         type: string
 *                         description: Team member's job profile
 *                       functionalArea:
 *                         type: string
 *                         description: Team member's functional area
 *                       firstName:
 *                         type: string
 *                         description: Team member's first name
 *                       lastName:
 *                         type: string
 *                         description: Team member's last name
 *                       middleName:
 *                         type: string
 *                         description: Team member's middle name
 *                       suffix:
 *                         type: string
 *                         description: Team member's name suffix
 *                       immediateManagerName:
 *                         type: string
 *                         description: Name of immediate manager
 *                       eventStatus:
 *                         type: string
 *                         enum: [registered, unregistered]
 *                         description: Status of team member's event registration
 *                       isPointsAwarded:
 *                         type: boolean
 *                         description: Whether points have been awarded
 *                       isSurveyDone:
 *                         type: boolean
 *                         description: Whether post-event survey is completed
 *                       invitedDate:
 *                         type: string
 *                         format: date-time
 *                         description: Date when team member was invited
 *                       tidsPractice:
 *                         type: string
 *                         description: TIDS practice area
 *       404:
 *         description: Event not found
 *       500:
 *         description: Failed to generate event invited team members report
 */
router.get('/event/:id/invitedTeamMember', ReportController.getEventInvitedTeamMembers);

/**
 * @swagger
 * /report/event/compliance:
 *   get:
 *     summary: Get compliance report
 *     tags: [Reports]
 *     description: Retrieve a compliance report for all events or a specific event
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Event ID (optional) - if provided, returns compliance for specific event
 *     responses:
 *       200:
 *         description: Compliance report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Overall compliance report for all events
 *                   properties:
 *                     totalEvents:
 *                       type: number
 *                       description: Total number of events
 *                     totalInvitesSent:
 *                       type: number
 *                       description: Total number of invitations sent
 *                     overallAttendees:
 *                       type: number
 *                       description: Total number of registered attendees
 *                     complianceBreakdown:
 *                       type: object
 *                       properties:
 *                         registered:
 *                           type: number
 *                           description: Number of registered attendees
 *                         unregistered:
 *                           type: number
 *                           description: Number of unregistered invitees
 *                     overallCompliancePercentage:
 *                       type: number
 *                       description: Overall compliance percentage
 *                     averageTargetCompliance:
 *                       type: number
 *                       description: Average target compliance across all events
 *                     eventReports:
 *                       type: array
 *                       description: Individual compliance reports for each event
 *                       items:
 *                         type: object
 *                         properties:
 *                           eventId:
 *                             type: string
 *                             description: Event ID
 *                           eventName:
 *                             type: string
 *                             description: Event name
 *                           targetCompliance:
 *                             type: number
 *                             description: Target compliance percentage
 *                           actualCompliancePercentage:
 *                             type: number
 *                             description: Actual achieved compliance percentage
 *                           complianceStatus:
 *                             type: string
 *                             enum: [Met, Not Met]
 *                             description: Whether compliance target was met
 *                     complianceStatus:
 *                       type: string
 *                       enum: [Met, Not Met]
 *                       description: Overall compliance status
 *                 - type: object
 *                   description: Compliance report for a specific event
 *                   properties:
 *                     eventId:
 *                       type: string
 *                       description: Event ID
 *                     eventName:
 *                       type: string
 *                       description: Event name
 *                     totalInvitesSent:
 *                       type: number
 *                       description: Number of invitations sent
 *                     overallAttendees:
 *                       type: number
 *                       description: Number of registered attendees
 *                     complianceBreakdown:
 *                       type: object
 *                       properties:
 *                         registered:
 *                           type: number
 *                           description: Number of registered attendees
 *                         unregistered:
 *                           type: number
 *                           description: Number of unregistered invitees
 *                     targetCompliance:
 *                       type: number
 *                       description: Target compliance percentage
 *                     actualCompliancePercentage:
 *                       type: number
 *                       description: Actual achieved compliance percentage
 *                     complianceStatus:
 *                       type: string
 *                       enum: [Met, Not Met]
 *                       description: Whether compliance target was met
 *       404:
 *         description: Event not found (when eventId is provided)
 *       500:
 *         description: Failed to generate compliance report
 */
router.get('/event/compliance', ReportController.getComplianceReport);

module.exports = router;

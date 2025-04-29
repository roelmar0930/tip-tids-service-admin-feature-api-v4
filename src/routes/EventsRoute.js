const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/EventsController");
const upload = require("../middleware/UploadMiddleware");
const {
  validateGetAllEvents,
  validateGetEventDetails,
  validateInvitedTeamMembersQuery
} = require("../middleware/validator/EventValidator");

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - details
 *         - venue
 *         - startDate
 *         - endDate
 *         - registrationCode
 *         - targetCompliance
 *         - category
 *         - type
 *         - numberOfInviteSent
 *         - imageFilename
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the event
 *         title:
 *           type: string
 *         details:
 *           type: string
 *         venue:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [inactive, active]
 *           default: inactive
 *         registrationCode:
 *           type: string
 *         targetCompliance:
 *           type: number
 *         category:
 *           type: string
 *           enum: [TIDS, teamEvent, happyhere, COP]
 *         type:
 *           type: string
 *         importance:
 *           type: string
 *         googleMeetLink:
 *           type: string
 *         postSurveyURL:
 *           type: string
 *         estimatedBudget:
 *           type: number
 *         numberOfInviteSent:
 *           type: number
 *         pointsNum:
 *           type: number
 *         imageFilename:
 *           type: string
 *         isCompleted:
 *           type: boolean
 *           default: false
 *         isCancelled:
 *           type: boolean
 *           default: false
 *         isArchived:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             workdayId:
 *               type: string
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         updatedBy:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             workdayId:
 *               type: string
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [inactive, active]
 *       - in: query
 *         name: isCompleted
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isArchived
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */
router.get("/", validateGetAllEvents, eventsController.getAllEvents);

/**
 * @swagger
 * /events/createEvent:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               details:
 *                 type: string
 *               venue:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               registrationCode:
 *                 type: string
 *               targetCompliance:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [TIDS, teamEvent, happyhere, COP]
 *               type:
 *                 type: string
 *               importance:
 *                 type: string
 *               googleMeetLink:
 *                 type: string
 *               postSurveyURL:
 *                 type: string
 *               estimatedBudget:
 *                 type: number
 *               imageFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/createEvent", upload.single("imageFile"), eventsController.createEvent);

/**
 * @swagger
 * /events/updateEvent:
 *   patch:
 *     summary: Update an existing event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               title:
 *                 type: string
 *               details:
 *                 type: string
 *               venue:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               registrationCode:
 *                 type: string
 *               targetCompliance:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum: [TIDS, teamEvent, happyhere, COP]
 *               type:
 *                 type: string
 *               importance:
 *                 type: string
 *               googleMeetLink:
 *                 type: string
 *               postSurveyURL:
 *                 type: string
 *               estimatedBudget:
 *                 type: number
 *               imageFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.patch("/updateEvent", upload.single("imageFile"), eventsController.updateEvent);

/**
 * @swagger
 * /events/deleteEvent/{id}:
 *   put:
 *     summary: Delete an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.put("/deleteEvent/:id", eventsController.deleteEvent);

/**
 * @swagger
 * /events/inviteTeamMember:
 *   post:
 *     summary: Invite team member to an event
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamMemberWorkdayId:
 *                 type: string
 *               teamMemberEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team member invited successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event or team member not found
 *       500:
 *         description: Server error
 */
router.post("/inviteTeamMember", eventsController.inviteTeamMember);

/**
 * @swagger
 * /events/updateInvitedTeamMember:
 *   patch:
 *     summary: Update invited team member status
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamMemberWorkdayId:
 *                 type: string
 *               teamMemberEmail:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [registered, unregistered]
 *     responses:
 *       200:
 *         description: Invited team member status updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Event or team member not found
 *       500:
 *         description: Server error
 */
router.patch("/updateInvitedTeamMember", eventsController.updateInviteTeamMember);

/**
 * @swagger
 * /events/teamMemberEvent:
 *   get:
 *     summary: Get team member events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: teamMemberWorkdayId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: teamMemberEmail
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of team member events
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.get("/teamMemberEvent", validateInvitedTeamMembersQuery, eventsController.getTeamMemberEvent);

/**
 * @swagger
 * /events/eventDetails/{id}:
 *   get:
 *     summary: Get event details
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.get("/eventDetails/:id", validateGetEventDetails, eventsController.getEventDetails);

module.exports = router;

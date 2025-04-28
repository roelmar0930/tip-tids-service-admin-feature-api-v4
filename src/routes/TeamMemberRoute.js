const express = require("express");
const router = express.Router();
const TeamMemberController = require("../controllers/TeamMemberController");
const TeamMemberPointsController = require("../controllers/TeamMemberPointsController");
const {
  validateGetTeamMemberEventsQuery,
  validateGetAllTeamMemberEventsQuery,
} = require("../middleware/validator/TeamMemberValidator");

/**
 * @swagger
 * tags:
 *   name: Team Members
 *   description: Team member management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamMember:
 *       type: object
 *       properties:
 *         workdayId:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *         department:
 *           type: string
 *     TeamMemberEvent:
 *       type: object
 *       properties:
 *         eventId:
 *           type: string
 *         teamMemberWorkdayId:
 *           type: string
 *         teamMemberEmail:
 *           type: string
 *         status:
 *           type: string
 *           enum: [registered, unregistered]
 *         isSurveyDone:
 *           type: boolean
 */

/**
 * @swagger
 * /teamMember/getAllTeamMember:
 *   get:
 *     summary: Get all team members
 *     tags: [Team Members]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter team members by role
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter team members by department
 *     responses:
 *       200:
 *         description: A list of team members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMember'
 *       404:
 *         description: Team members not found
 *       500:
 *         description: Server error
 */
router.get("/getAllTeamMember", TeamMemberController.getAllTeamMember);

/**
 * @swagger
 * /teamMember/getTeamMember:
 *   get:
 *     summary: Get a specific team member
 *     tags: [Team Members]
 *     parameters:
 *       - in: query
 *         name: workdayId
 *         required: true
 *         schema:
 *           type: string
 *         description: Workday ID of the team member
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the team member
 *     responses:
 *       200:
 *         description: Details of the team member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMember'
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
router.get("/getTeamMember", TeamMemberController.getTeamMember);

/**
 * @swagger
 * /teamMember/addEvent:
 *   post:
 *     summary: Add an event to a team member
 *     tags: [Team Members]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to be added
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamMemberWorkdayId
 *               - teamMemberEmail
 *             properties:
 *               teamMemberWorkdayId:
 *                 type: string
 *               teamMemberEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMemberEvent'
 *       409:
 *         description: Team member already has this event assigned
 *       404:
 *         description: Team member or event not found
 *       500:
 *         description: Server error
 */
router.post("/addEvent", TeamMemberController.addEvent);

/**
 * @swagger
 * /teamMember/updateEvent:
 *   patch:
 *     summary: Update an event for a team member
 *     tags: [Team Members]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [registered, unregistered]
 *               isSurveyDone:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMemberEvent'
 *       409:
 *         description: Team member event not found
 *       404:
 *         description: Team member or event not found
 *       500:
 *         description: Server error
 */
router.patch("/updateEvent", TeamMemberController.updateEvent);

/**
 * @swagger
 * /teamMember/getPoints:
 *   get:
 *     summary: Get points for a team member
 *     tags: [Team Members]
 *     parameters:
 *       - in: query
 *         name: workdayId
 *         required: true
 *         schema:
 *           type: string
 *         description: Workday ID of the team member
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the team member
 *     responses:
 *       200:
 *         description: Points details of the team member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamMemberPoints'
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */
router.get("/getPoints", TeamMemberPointsController.getTeamMemberPoints);

module.exports = router;

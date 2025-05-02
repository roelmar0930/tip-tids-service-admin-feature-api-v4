const express = require("express");
const router = express.Router();
const TeamMemberController = require("../controllers/TeamMemberController");
const TeamMemberPointsController = require("../controllers/TeamMemberPointsController");
const {
  validateGetTeamMemberQuery
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
 *       required:
 *         - workdayId
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         workdayId:
 *           type: string
 *           description: Workday ID of the team member
 *         firstName:
 *           type: string
 *           description: First name of the team member
 *         lastName:
 *           type: string
 *           description: Last name of the team member
 *         middleName:
 *           type: string
 *           description: Middle name of the team member
 *         suffix:
 *           type: string
 *           description: Suffix of the team member's name
 *         email:
 *           type: string
 *           description: Email address of the team member
 *         jobProfile:
 *           type: string
 *           description: Job profile of the team member
 *         bussinessTitle:
 *           type: string
 *           description: Business title of the team member
 *         jobCode:
 *           type: string
 *           description: Job code of the team member
 *         supervisor:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email of the supervisor
 *             name:
 *               type: string
 *               description: Name of the supervisor
 *             workdayId:
 *               type: string
 *               description: Workday ID of the supervisor
 *         operationalManager:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email of the operational manager
 *             name:
 *               type: string
 *               description: Name of the operational manager
 *             workdayId:
 *               type: string
 *               description: Workday ID of the operational manager
 *         functionalArea:
 *           type: string
 *           description: Functional area of the team member
 *         site:
 *           type: string
 *           description: Site of the team member
 *         originalHireDate:
 *           type: string
 *           format: date
 *           description: Original hire date of the team member
 *         hireDate:
 *           type: string
 *           format: date
 *           description: Hire date of the team member
 *         continuousServiceDate:
 *           type: string
 *           format: date
 *           description: Continuous service date of the team member
 *         yearOfService:
 *           type: integer
 *           description: Years of service of the team member
 *         employeeType:
 *           type: string
 *           description: Type of employee
 *         practice:
 *           type: string
 *           description: Practice area of the team member
 *         group:
 *           type: string
 *           description: Group of the team member
 *         role:
 *           type: string
 *           description: Role of the team member
 *           enum: [teamMember, teamLeader, teamManager]
 *           default: teamMember
 *         status:
 *           type: string
 *           description: Status of the team member
 *           enum: [active, terminated]
 *           default: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date of the team member record
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date of the team member record
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
 *     TeamMemberPoints:
 *       type: object
 *       required:
 *         - teamMemberWorkdayId
 *         - teamMemberEmail
 *         - year
 *         - starPoints
 *         - starsPesoConversion
 *         - starsDeduction
 *         - copPoints
 *         - copPesoConversion
 *         - copDeduction
 *       properties:
 *         teamMemberWorkdayId:
 *           type: string
 *           description: Workday ID of the team member
 *         teamMemberEmail:
 *           type: string
 *           description: Email of the team member
 *         year:
 *           type: integer
 *           description: Year for which the points are recorded
 *         starPoints:
 *           type: number
 *           description: Number of star points earned
 *         starsPesoConversion:
 *           type: number
 *           description: Peso conversion value for star points
 *         starsDeduction:
 *           type: number
 *           description: Deductions from star points
 *         copPoints:
 *           type: number
 *           description: Number of COP (Community of Practice) points earned
 *         copPesoConversion:
 *           type: number
 *           description: Peso conversion value for COP points
 *         copDeduction:
 *           type: number
 *           description: Deductions from COP points
 */

/**
 * @swagger
 * /teamMember/getAllTeamMember:
 *   get:
 *     summary: Get all team members
 *     tags: [Team Members]
 *     parameters:
 *       - in: query
 *         name: operationalManager.workdayId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter team members by operationalManager.workdayId
 *       - in: query
 *         name: supervisor.workdayId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter team members by supervisor.workdayId
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
router.get("/getAllTeamMember", validateGetTeamMemberQuery, TeamMemberController.getAllTeamMember);

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

/**
 * @swagger
 * /teamMember/bulkSyncTeamMembers:
 *   post:
 *     summary: Bulk update or add team members from CSV
 *     tags: [Team Members]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Team members updated or added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedCount:
 *                   type: number
 *                 addedCount:
 *                   type: number
 *       400:
 *         description: Invalid file format or missing file
 *       500:
 *         description: Server error
 */
router.post("/bulkSyncTeamMembers", TeamMemberController.bulkSyncTeamMembers);

module.exports = router;

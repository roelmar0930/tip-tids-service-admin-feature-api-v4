const express = require("express");
const router = express.Router();
const ActiveLogController = require("../controllers/ActiveLogController");

/**
 * @swagger
 * tags:
 *   name: Active Logs
 *   description: Activity logging endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ActiveLog:
 *       type: object
 *       required:
 *         - resource
 *         - action
 *         - author
 *       properties:
 *         resource:
 *           type: string
 *           description: The type of resource being logged (e.g., 'User', 'Event')
 *           example: Event
 *         action:
 *           type: string
 *           description: The action performed (e.g., 'create', 'update', 'delete')
 *           example: create
 *         details:
 *           type: object
 *           description: Additional details about the action
 *           example: { "eventId": "123", "title": "New Event" }
 *         author:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               description: Email of the user who performed the action
 *               example: user@example.com
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the action was performed
 *           example: "2025-04-28T13:26:13Z"
 */

/**
 * @swagger
 * /activelog/createActiveLog:
 *   post:
 *     summary: Create a new activity log
 *     tags: [Active Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActiveLog'
 *     responses:
 *       201:
 *         description: Activity log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActiveLog'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid input data
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to create log
 */
router.post("/createActiveLog", ActiveLogController.createLog);

/**
 * @swagger
 * /activelog/getAllActivelog:
 *   get:
 *     summary: Get all activity logs
 *     tags: [Active Logs]
 *     responses:
 *       200:
 *         description: List of all activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActiveLog'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch logs
 */
router.get("/getAllActivelog", ActiveLogController.getAllLogs);

/**
 * @swagger
 * /activelog/resource/{resource}:
 *   get:
 *     summary: Get logs by resource
 *     tags: [Active Logs]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *         description: The resource type to filter logs (e.g., 'Event', 'User')
 *     responses:
 *       200:
 *         description: List of logs for the specified resource
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActiveLog'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch logs
 */
router.get(
  "/activelog/resource/:resource",
  ActiveLogController.getLogsByResource
);

/**
 * @swagger
 * /activelog/author/{email}:
 *   get:
 *     summary: Get logs by author email
 *     tags: [Active Logs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the author to filter logs
 *     responses:
 *       200:
 *         description: List of logs for the specified author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActiveLog'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch logs
 */
router.get(
  "/activelog/author/:email",
  ActiveLogController.getLogsByAuthorEmail
);

module.exports = router;

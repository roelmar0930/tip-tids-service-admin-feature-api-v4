const express = require("express");
const router = express.Router();
const taskController = require("../controllers/TaskController");
const jwtAuthenticator = require('../utils/JWTAuthenticator');
const timeZone = require('../middleware/timeZone');
const {
  validateGetAllTasks,
} = require("../middleware/validator/TaskValidator");

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           unique: true
 *         title:
 *           type: string
 *           required: true
 *         details:
 *           type: string
 *           required: true
 *         importance:
 *           type: string
 *           required: true
 *         dueDate:
 *           type: string
 *           format: date-time
 *           required: true
 *         link:
 *           type: string
 *         imageUrl:
 *           type: string
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
 *               required: true
 *             workdayId:
 *               type: number
 *               required: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         updatedBy:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             workdayId:
 *               type: number
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Get tasks
 *     tags: [Tasks]
 *     description: Retrieve a list of tasks based on filters
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *           default: UTC
 *         description: Client's timezone (e.g., 'Asia/Shanghai', 'America/New_York'). Defaults to UTC if not provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               importance:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *               isArchived:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    timeZone,
    validateGetAllTasks,
    taskController.getTasks
);

/**
 * @swagger
 * /task/createTask:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     description: Create a new task and automatically assign it to team members
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *           default: UTC
 *         description: Client's timezone (e.g., 'Asia/Shanghai', 'America/New_York'). Defaults to UTC if not provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 */
router.post("/createTask", timeZone, taskController.createTask);

/**
 * @swagger
 * /task/updateTask:
 *   patch:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     description: Update the details of an existing task
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *           default: UTC
 *         description: Client's timezone (e.g., 'Asia/Shanghai', 'America/New_York'). Defaults to UTC if not provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 */
router.patch("/updateTask", timeZone, taskController.updateTask);

/**
 * @swagger
 * /task/assignTask:
 *   post:
 *     summary: Assign a task to a team member
 *     tags: [Tasks]
 *     description: Assign a specific task to a team member
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *           default: UTC
 *         description: Client's timezone (e.g., 'Asia/Shanghai', 'America/New_York'). Defaults to UTC if not provided.
 *       - in: query
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamMemberId:
 *                 type: string
 *                 description: ID of the team member to assign the task to
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       500:
 *         description: Internal server error
 */
router.post("/assignTask", timeZone, taskController.assignTask);

/**
 * @swagger
 * /task/updateAssignedTask:
 *   patch:
 *     summary: Update an assigned task
 *     tags: [Tasks]
 *     description: Update the status of a task assigned to a team member
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *           default: UTC
 *         description: Client's timezone (e.g., 'Asia/Shanghai', 'America/New_York'). Defaults to UTC if not provided.
 *       - in: query
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamMemberId:
 *                 type: string
 *                 description: ID of the team member assigned to the task
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *                 description: New status of the task
 *     responses:
 *       200:
 *         description: Assigned task updated successfully
 *       500:
 *         description: Internal server error
 */
router.patch("/updateAssignedTask", timeZone, taskController.updateAssignedTask);

/**
 * @swagger
 * /task/assignedTask:
 *   post:
 *     summary: Get assigned tasks with filter
 *     tags: [Tasks]
 *     description: Retrieve a list of tasks assigned to a team member based on filters
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *           default: UTC
 *         description: Client's timezone (e.g., 'Asia/Shanghai', 'America/New_York'). Defaults to UTC if not provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamMemberId:
 *                 type: string
 *                 description: ID of the team member to get tasks for
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *                 description: Filter tasks by status
 *     responses:
 *       200:
 *         description: A list of assigned tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 */
router.post("/assignedTask", timeZone, taskController.getAssignedTaskWithFilter);

/**
 * @swagger
 * /task/deleteTask/{taskId}:
 *   put:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     description: Mark a task as deleted (soft delete)
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *         description: Task ID to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       500:
 *         description: Internal server error
 */
router.put("/deleteTask/:taskId", taskController.deleteTask);

/**
 * @swagger
 * /task/getAssignedTaskDetails:
 *   get:
 *     summary: Get assigned task details
 *     tags: [Tasks]
 *     description: Get detailed information about a task assigned to a team member
 *     parameters:
 *       - in: header
 *         name: x-timezone
 *         schema:
 *           type: string
 *           default: UTC
 *         description: Client's timezone (e.g., 'Asia/Shanghai', 'America/New_York'). Defaults to UTC if not provided.
 *       - in: query
 *         name: teamMemberEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the team member
 *       - in: query
 *         name: teamMemberWorkdayId
 *         required: true
 *         schema:
 *           type: string
 *         description: Workday ID of the team member
 *     responses:
 *       200:
 *         description: Assigned task details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Internal server error
 */
router.get("/getAssignedTaskDetails", timeZone, taskController.getAssignedTaskDetails);

module.exports = router;

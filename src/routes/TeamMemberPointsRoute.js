const express = require("express");
const router = express.Router();
const TeamMemberPointsController = require("../controllers/TeamMemberPointsController");

/**
 * @swagger
 * tags:
 *   name: Team Member Points
 *   description: Team member points management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
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
 *           type: number
 *           description: Team member's Workday ID
 *         teamMemberEmail:
 *           type: string
 *           description: Team member's email address
 *         year:
 *           type: number
 *           description: Year for which points are recorded
 *         starPoints:
 *           type: number
 *           description: Total STAR points earned
 *         starsPesoConversion:
 *           type: number
 *           description: STAR points converted to peso value
 *         starsDeduction:
 *           type: number
 *           description: Deductions from STAR points
 *         copPoints:
 *           type: number
 *           description: Total COP points earned
 *         copPesoConversion:
 *           type: number
 *           description: COP points converted to peso value
 *         copDeduction:
 *           type: number
 *           description: Deductions from COP points
 */

/**
 * @swagger
 * /teamMemberPoints/addPoints:
 *   post:
 *     summary: Add points to a team member
 *     tags: [Team Member Points]
 *     description: Add STAR or COP points to a team member's account for the current year
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamMemberEmail
 *               - teamMemberWorkdayId
 *               - points
 *               - category
 *             properties:
 *               teamMemberEmail:
 *                 type: string
 *                 description: Team member's email address
 *               teamMemberWorkdayId:
 *                 type: number
 *                 description: Team member's Workday ID
 *               points:
 *                 type: number
 *                 description: Number of points to add
 *               category:
 *                 type: string
 *                 enum: [STAR, COP]
 *                 description: Category of points to add
 *     responses:
 *       200:
 *         description: Points added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Points added successfully
 *       404:
 *         description: Team member not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Team member not found in roster
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/addPoints", TeamMemberPointsController.addPoints);

/**
 * @swagger
 * /teamMemberPoints/getPoints:
 *   get:
 *     summary: Get team member points
 *     tags: [Team Member Points]
 *     description: Retrieve points information for a team member
 *     parameters:
 *       - in: query
 *         name: teamMemberEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: Team member's email address
 *       - in: query
 *         name: teamMemberWorkdayId
 *         required: true
 *         schema:
 *           type: number
 *         description: Team member's Workday ID
 *       - in: query
 *         name: year
 *         schema:
 *           type: number
 *         description: Optional year filter (defaults to current year)
 *     responses:
 *       200:
 *         description: Team member points retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TeamMemberPoints'
 *       404:
 *         description: No points record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No points record found for the specified team member
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/getPoints", TeamMemberPointsController.getTeamMemberPoints);

module.exports = router;

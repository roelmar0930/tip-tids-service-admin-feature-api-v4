const express = require("express");
const { checkStatus } = require("../controllers/HealthCheckController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health Check
 *   description: API health check endpoints
 */

/**
 * @swagger
 * /healthcheck/status:
 *   get:
 *     summary: Check API health status
 *     tags: [Health Check]
 *     description: Returns the health status of the API. Used for monitoring and health checks.
 *     responses:
 *       200:
 *         description: API is healthy and functioning normally
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - status
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [ok]
 *                   description: Health status indicator
 *                   example: ok
 *       500:
 *         description: API is not healthy or experiencing issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - status
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [error]
 *                   description: Error status indicator
 *                   example: error
 */
router.get("/status", checkStatus);

module.exports = router;

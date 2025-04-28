const express = require("express");
const router = express.Router();
const ImageController = require("../controllers/ImageController");
const {
  validateGetSignedUrl,
} = require("../middleware/validator/ImageValidator");

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Image management endpoints
 */

/**
 * @swagger
 * /image/getSignedUrl:
 *   get:
 *     summary: Get a signed URL for an image
 *     tags: [Images]
 *     description: Retrieve a signed URL for accessing an image file. The URL expires after 24 hours.
 *     parameters:
 *       - in: query
 *         name: fileType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [images]
 *         description: Type of the file (currently only supports 'images')
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file including extension (e.g., 'event-banner.jpg')
 *       - in: query
 *         name: moduleName
 *         required: true
 *         schema:
 *           type: string
 *           enum: [event, task]
 *         description: Name of the module the image belongs to
 *     responses:
 *       200:
 *         description: Signed URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: The signed URL for accessing the image (valid for 24 hours)
 *       400:
 *         description: Invalid input parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       404:
 *         description: Image not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/getSignedUrl", validateGetSignedUrl, ImageController.getSignedUrl);

module.exports = router;

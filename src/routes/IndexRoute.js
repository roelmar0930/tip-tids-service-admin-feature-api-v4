const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get home page
 *     description: Renders the home page of the Admin Feature API
 *     responses:
 *       200:
 *         description: Home page rendered successfully
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Admin Feature API' });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const ImageController = require("../controllers/ImageController");
const {
  validateGetSignedUrl,
} = require("../middleware/validator/ImageValidator");

router.get("/getSignedUrl", validateGetSignedUrl, ImageController.getSignedUrl);

module.exports = router;

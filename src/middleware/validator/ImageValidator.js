// middlewares/validation.js
const { query, validationResult } = require("express-validator");

// File Types
const FILE_TYPE = {
  IMAGES: "images",
};

const MODULE_NAME = {
  EVENT: "event",
  TASK: "task",
};

// Custom validation function for fileType
const isValidFileType = (value) => {
  const fileTypes = Object.values(FILE_TYPE);
  if (!fileTypes.includes(value)) {
    throw new Error(`File type must be one of: ${fileTypes.join(", ")}`);
  }
  return true;
};

// Custom validation function for moduleName
const isValidModuleName = (value) => {
  const moduleNames = Object.values(MODULE_NAME);
  if (!moduleNames.includes(value)) {
    throw new Error(`Module name must be one of: ${moduleNames.join(", ")}`);
  }
  return true;
};

const validateGetSignedUrl = [
  query("fileType")
    .notEmpty()
    .withMessage("File type is required")
    .isString()
    .withMessage("File type must be a string")
    .custom(isValidFileType),
  query("fileName")
    .notEmpty()
    .withMessage("File name is required")
    .isString()
    .withMessage("File name must be a string"),
  query("moduleName")
    .notEmpty()
    .withMessage("Module name is required")
    .isString()
    .withMessage("Module name must be a string")
    .custom(isValidModuleName),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateGetSignedUrl,
};

// middlewares/validation.js
const { query, body, param, validationResult } = require("express-validator");
const { EVENT_STATUS } = require("../../constant/EventConstant");

const isValidStatus = (value) => {
  const statuses = Object.values(EVENT_STATUS);
  if (!statuses.includes(value)) {
    throw new Error(`Status must be one of: ${statuses.join(", ")}`);
  }
  return true;
};

const validateGetAllEvents = [
  query("status")
    .optional()
    .isString()
    .withMessage("Status must be a string")
    .custom(isValidStatus),
  query("isCompleted")
    .optional()
    .isBoolean()
    .withMessage("isCompleted must be a boolean"),
  query("isArchived")
    .optional()
    .isBoolean()
    .withMessage("isArchived must be a boolean"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateGetEventDetails = [
  query("")
    .notEmpty()
    .withMessage("ID is required")
    .isInt()
    .withMessage("ID must be a number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation rules for URL parameters (e.g., event ID)
const validateEventParams = [
  param("").isInt().withMessage("ID must be an integer"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateGetAllEvents,
  validateGetEventDetails,
  validateEventParams,
};

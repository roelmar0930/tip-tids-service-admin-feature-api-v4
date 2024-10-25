// middlewares/validation.js
const { query, body, param, validationResult } = require("express-validator");
const { TASK_STATUS } = require("../../constant/TaskConstant");

const isValidStatus = (value) => {
  const statuses = Object.values(TASK_STATUS);
  if (!statuses.includes(value)) {
    throw new Error(`Status must be one of: ${statuses.join(", ")}`);
  }
  return true;
};

const validateGetAllTasks = [
  query("importance")
    .optional()
    .isString()
    .withMessage("Importance must be a string"),
  query("status")
    .optional()
    .isString()
    .withMessage("Status must be a string")
    .custom(isValidStatus),
  // query("dueDate")
  //   .optional()
  //   .isDate()
  //   .withMessage("Due Date must be a date"),
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

const validateGetTaskDetails = [
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

// Validation rules for URL parameters (e.g., task ID)
const validateTaskParams = [
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
  validateGetAllTasks,
  validateGetTaskDetails,
  validateTaskParams,
};

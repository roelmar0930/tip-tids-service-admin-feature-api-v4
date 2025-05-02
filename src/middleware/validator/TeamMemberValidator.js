// middlewares/validation.js
const { query, validationResult } = require("express-validator");
const { TEAM_MEMBER_EVENT_STATUS } = require("../../constant/EventConstant");

const isValidStatus = (value) => {
  const statuses = Object.values(TEAM_MEMBER_EVENT_STATUS);
  if (!statuses.includes(value)) {
    throw new Error(`Status must be one of: ${statuses.join(", ")}`);
  }
  return true;
};

const validateGetTeamMemberQuery = [
  query("operationalManager.workdayId")
    .optional()
    .isString()
    .withMessage("operationalManager.workdayId must be a string"),
  query("supervisor.workdayId")
    .optional()
    .isString()
    .withMessage("supervisor.workdayId must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateGetTeamMemberQuery
};

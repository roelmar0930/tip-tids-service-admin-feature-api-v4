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

const validateGetTeamMemberEventsQuery = [
  query("eventId")
    .optional()
    .isString()
    .withMessage("eventId must be a string"),
  query("isSurveyDone")
    .optional()
    .isBoolean()
    .withMessage("isSurveyDone must be a boolean"),
  query("teamMemberWorkdayId")
    .optional()
    .isString()
    .withMessage("teamMemberWorkdayId must be a string"),
  query("teamMemberEmail")
    .optional()
    .isString()
    .withMessage("teamMemberEmail must be a string"),
  query("status")
    .optional()
    .isString()
    .withMessage("status must be a string")
    .custom(isValidStatus),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateGetAllTeamMemberEventsQuery = [
  query("teamMemberWorkdayId")
    .optional()
    .isString()
    .withMessage("teamMemberWorkdayId must be a string"),
  query("teamMemberEmail")
    .optional()
    .isString()
    .withMessage("teamMemberEmail must be a string"),
  query("status")
    .optional()
    .isString()
    .withMessage("status must be a string")
    .custom(isValidStatus),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { teamMemberWorkdayId, teamMemberEmail, eventId } = req.query;

    if (!teamMemberWorkdayId && !teamMemberEmail && !eventId) {
      return res.status(400).json({
        errors: [
          {
            msg: "Either teamMemberWorkdayId or teamMemberEmail is required",
            param: "teamMemberWorkdayId or teamMemberEmail or eventId",
            location: "query",
          },
        ],
      });
    }

    // If validation passes, proceed to the next middleware
    next();
  },
];

module.exports = {
  validateGetTeamMemberEventsQuery,
  validateGetAllTeamMemberEventsQuery,
};

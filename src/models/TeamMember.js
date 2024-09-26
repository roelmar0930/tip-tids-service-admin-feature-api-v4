const mongoose = require("mongoose");
const { formatDateToManilaUTC } = require("../utils/DateUtils");

const teamMemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  suffix: {
    type: String,
  },
  jobProfile: {
    type: String,
  },
  workEmailAddress: {
    type: String,
    required: true,
  },
  workdayId: {
    type: String,
    required: true,
  },
  immediateManagerName: {
    type: String,
  },
  immediateManagerWorkdayId: {
    type: String,
  },
  functionalArea: {
    type: String,
  },
  site: {
    type: String,
  },
  hireDate: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: formatDateToManilaUTC(new Date()),
  },
  updatedAt: {
    type: Date,
  },
});

teamMemberSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const TeamMember = mongoose.model(
  "TEAM_MEMBER",
  teamMemberSchema,
  "TEAM_MEMBER"
);

module.exports = TeamMember;

const mongoose = require("mongoose");

const teamMemberEventSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    required: true,
  },
  teamMemberWorkdayId: {
    type: String,
    required: true,
  },
  teamMemberEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["registered", "unregistered"],
    default: "unregistered",
    required: true,
  },
  isPointsAwarded: {
    type: Boolean,
    default: false,
  },
  isSurveyDone: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
  },
});

teamMemberEventSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const TeamMemberEvent = mongoose.model(
  "TEAM_MEMBER_EVENT",
  teamMemberEventSchema,
  "TEAM_MEMBER_EVENT"
);

module.exports = TeamMemberEvent;

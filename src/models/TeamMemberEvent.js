const mongoose = require("mongoose");

const teamMemberEventSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
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

teamMemberEventSchema.pre("validate", async function (next) {
  const doc = this;

  if (doc.isNew) {
    try {
      const lastDoc = await TeamMemberEvent.findOne(
        {},
        {},
        { sort: { id: -1 } }
      );
      const nextId = lastDoc ? lastDoc.id + 1 : 1;
      doc.id = nextId;
    } catch (error) {
      return next(error);
    }
  }

  next();
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

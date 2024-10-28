const mongoose = require("mongoose");

const teamMemberPointsSchema = new mongoose.Schema({
  teamMemberWorkdayId: {
    type: Number,
    required: true,
  },
  teamMemberEmail: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  starPoints: {
    type: Number,
    required: true,
  },
  starsPesoConversion: {
    type: Number,
    required: true,
  },
  starsDeduction: {
    type: Number,
    required: true,
  },
  copPoints: {
    type: Number,
    required: true,
  },
  copPesoConversion: {
    type: Number,
    required: true,
  },
  copDeduction: {
    type: Number,
    required: true,
  },
});

teamMemberPointsSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    const lastId = await TeamMemberPoints.findOne({}, {}, { sort: { id: -1 } });
    const nextId = lastId ? lastId.id + 1 : 10000000;
    doc.id = nextId;
  }
  next();
});

const TeamMemberPoints = mongoose.model(
  "TEAM_MEMBER_POINTS",
  teamMemberPointsSchema,
  "TEAM_MEMBER_POINTS"
);

module.exports = TeamMemberPoints;

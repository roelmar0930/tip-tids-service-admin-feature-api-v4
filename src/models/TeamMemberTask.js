const mongoose = require("mongoose");
const { formatDateToManilaUTC } = require("../utils/DateUtils");

const teamMemberTaskSchema = new mongoose.Schema({
  taskId: {
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
    enum: ["notStarted", "inProgress", "completed"],
    default: "notStarted",  
    required: true,
  },
  assignedDate: {
    type: Date,
    default: formatDateToManilaUTC(new Date()),
  },
  startedDate: {
    type: Date,
  },
  completionDate:{
    type: Date
  }
});

teamMemberTaskSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const TeamMemberTask = mongoose.model(
  "TEAM_MEMBER_TASK",
  teamMemberTaskSchema,
  "TEAM_MEMBER_TASK"
);

module.exports = TeamMemberTask;

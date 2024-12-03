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
    default: "teamMember", // Default to 'teamMember'
  },
  tidsPractice: {
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

// Pre-save hook to set 'role' dynamically based on 'jobProfile'
teamMemberSchema.pre("save", function (next) {
  if (this.jobProfile) {
    const jobProfileLower = this.jobProfile.toLowerCase();

    if (jobProfileLower.includes("manage")) {
      this.role = "teamManager";
    } else if (jobProfileLower.includes("leader")) {
      this.role = "teamLeader";
    } else {
      this.role = "teamMember";
    }
  }
  next();
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

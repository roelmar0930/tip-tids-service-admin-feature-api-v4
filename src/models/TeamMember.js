const mongoose = require("mongoose");
const { formatDateToManilaUTC } = require("../utils/DateUtils");

const teamMemberSchema = new mongoose.Schema({
  workdayId: {
    type: String,
    required: true,
  },
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
  email: {
    type: String,
    required: true,
  },
  jobProfile: {
    type: String,
  },
  businessTitle: {
    type: String,
  },
  jobCode: {
    type: String,
  },
  supervisor: {
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    workdayId: {
      type: String,
    },
  },
  operationalManager: {
    email: {
      type: String,
    },
    name: {
      type: String,
    },
    workdayId: {
      type: String,
    },
  },
  functionalArea: {
    type: String,
  },
  site: {
    type: String,
  },
  originalHireDate: {
    type: Date,
  },
  hireDate: {
    type: Date,
  },
  continuousServiceDate: {
    type: Date,
  },
  yearOfService: {
    type: Number,
  },
  employeeType: {
    type: String,
  },
  practice: {
    type: String,
  },
  group: {
    type: String,
  },
  role: {
    type: String,
    default: "teamMember", // Default to 'teamMember'
  },
  status: {
    type: String,
    enum: ["active", "terminated"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
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

function localizeDate(date) {
  if (date instanceof Date) {
    const utcDate = new Date(date);
    return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
  }
  return date;
}

teamMemberSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    if (ret.createdAt) {
      ret.createdAt = localizeDate(ret.createdAt);
    }
    if (ret.updatedAt) {
      ret.updatedAt = localizeDate(ret.updatedAt);
    }

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

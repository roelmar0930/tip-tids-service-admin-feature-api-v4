const mongoose = require("mongoose");

let TeamRoster;

try {
  TeamRoster = mongoose.model("TeamRoster", teamRosterSchema, "teamRoster");
} catch (error) {
  const { Schema } = mongoose;
  const teamRosterSchema = new Schema({
    workorderId: {
      type: Number,
    },
    employeeName: {
      type: String,
    },
    jobProfile: {
      type: String,
    },
    immediateManager: {
      type: String,
    },
    immediateManagerWorkorderId: {
      type: Number,
    },
    functionalArea: {
      type: Number,
    },
    site: {
      type: String,
    },
    hireDate: {
      type: String,
    },
    yearsOfService: {
      type: Number,
    },
    workEmailAddress: {
      type: String,
    },
    tidsPractice: {
      type: String,
    },
    role: {
      type: String,
    },
  });

  // to remove the default properties of the JSON that is not needed after POST and set the default id to eventId
  teamRosterSchema.set("toJSON", {
    transform: (doc, ret, options) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });

  TeamRoster = mongoose.model("TeamRoster", teamRosterSchema, "teamRoster");
}

module.exports = TeamRoster;

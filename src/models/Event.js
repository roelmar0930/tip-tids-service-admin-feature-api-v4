const mongoose = require("mongoose");
const { formatDateToManilaUTC } = require("../utils/DateUtils");

const eventSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    require: true,
  },
  details: {
    type: String,
    require: true,
  },
  venue: {
    type: String,
    require: true,
  },
  startDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
  status: {
    type: String,
    default: "inactive",
    require: true,
  },
  registrationCode: {
    type: String,
    require: true,
  },
  targetCompliance: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  importance: {
    type: String,
  },
  googleMeetLink: {
    type: String,
  },
  postSurveyURL: {
    type: String,
  },
  estimatedBudget: {
    type: Number,
  },
  numberOfInviteSent: {
    type: Number,
    require: true,
  },
  pointsNum: {
    type: Number,
    require: true,
  },
  imageFilename: {
    type: String,
    require: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
    require: true,
  },
  isCancelled: {
    type: Boolean,
    default: false,
    require: true,
  },
  isArchived: {
    type: Boolean,
    default: false,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    email: {
      type: String,
      require: true,
    },
    workdayId: {
      type: String,
      require: true,
    },
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    email: {
      type: String,
    },
    workdayId: {
      type: String,
    },
  },
});

// Middleware to set pointsNum before saving
eventSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    const lastId = await Event.findOne({}, {}, { sort: { id: -1 } });
    const nextId = lastId ? lastId.id + 1 : 1;
    doc.id = nextId;
  }

   // Update the updatedAt field
   if (!doc.isNew) {
    doc.updatedAt = new Date();
  }

  if (this.category === "TIDS") {
    this.pointsNum = 50;
  } else if (this.category === "teamEvent") {
    this.pointsNum = 30;
  } else if (this.category === "happyhere") {
    this.pointsNum = 20;
  } else if (this.category === "COP") {
    this.pointsNum = 10;
  }
  next();
});

// Middleware to set pointsNum before updating
eventSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.category === "TIDS") {
    update.pointsNum = 50;
  } else if (update.category === "teamEvent") {
    update.pointsNum = 30;
  } else if (update.category === "happyhere") {
    update.pointsNum = 20;
  } else if (update.category === "COP") {
    update.pointsNum = 10;
  }

  next();
});

eventSchema.set("toJSON", {
  transform: (doc, ret, options) => {
     delete ret.__v;
     return ret;
  },
});

const Event = mongoose.model("Event", eventSchema, "EVENT");

module.exports = Event;

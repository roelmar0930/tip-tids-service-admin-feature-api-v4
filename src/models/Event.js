const mongoose = require("mongoose");
const { formatDateToManilaUTC } = require("../utils/DateUtils");

let Event;

try {
  Event = mongoose.model("event");
} catch (error) {
  const { Schema } = mongoose;
  const eventSchema = new Schema({
    eventId: {
      type: Number,
    },
    title: {
      type: String,
    },
    eventDetails: {
      type: String,
    },
    venueDetails: {
      type: String,
    },
    pictureUrl: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    code: {
      type: String,
    },
    category: {
      type: String,
    },
    eventType: {
      type: String,
    },
    importance: {
      type: String,
    },
    gmeetLink: {
      type: String,
    },
    postEventSurveyURL: {
      type: String,
    },
    estimatedBudget: {
      type: Number,
    },
    numberOfInviteSent: {
      type: Number,
    },
    starsNum: {
      type: Number,
    },
    regLink: {
      type: String,
    },
    qrLink: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: formatDateToManilaUTC(new Date()),
    },
    createdBy: {
      type: String,
    },
    updatedAt: {
      type: Date,
    },
    updatedBy: {
      type: String,
    },
    qrCodeUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    authenticatedUrl: {
      type: String,
    },
    status: {
      type: String,
      default: "Inactive",
    },
    eventType: {
      type: String,
    },
    attendees: {
      type: Number,
    },
    registrants: {
      type: Number,
    },
    didNotAttend: {
      type: Number,
    },
    targetCompliance: {
      type: Number,
    },
    tinyUrl: {
      type: String,
    },
    modalUrl: {
      type: String,
    },
    registrationCode: {
      type: String,
    },
  });

  // Middleware to set starsNum before saving
  eventSchema.pre("save", function (next) {
    if (this.category === "TIDS") {
      this.starsNum = 50;
    } else if (this.category === "teamEvent") {
      this.starsNum = 30;
    } else if (this.category === "happyhere") {
      this.starsNum = 20;
    } else if (this.category === "COP") {
      this.starsNum = 10;
    }
    next();
  });

  // Middleware to set starsNum before updating
  eventSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();

    if (update.category === "TIDS") {
      update.starsNum = 50;
    } else if (update.category === "teamEvent") {
      update.starsNum = 30;
    } else if (update.category === "happyhere") {
      update.starsNum = 20;
    } else if (update.category === "COP") {
      update.starsNum = 10;
    }

    next();
  });

  // to remove the default properties of the JSON that is not needed after POST and set the default id to eventId
  eventSchema.set("toJSON", {
    transform: (doc, ret, options) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });

  Event = mongoose.model("event", eventSchema);
}

module.exports = Event;

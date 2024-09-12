const mongoose = require("mongoose");

let Registration;

try {
  Registration = mongoose.model("registration");
} catch (error) {
  const { Schema } = mongoose;
  const registrationSchema = new Schema({
    eventId: {
      type: Number,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    pointsAwarded: {
      type: Boolean,
      default: false,
    },
  });

  registrationSchema.set("toJSON", {
    transform: (doc, ret, options) => {
      delete ret.__v;
      return ret;
    },
  });

  Registration = mongoose.model("registration", registrationSchema);
}

module.exports = Registration;

const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema outside of the try-catch block
const teamMemberPointSchema = new Schema({
  workdayId: {
    type: Number,
  },
  employeeName: {
    type: String,
  },
  email: {
    type: String,
  },
  year: {
    type: Number,
  },
  starPoints: {
    type: Number,
    default: 0, // Ensure the field is created with a default value if empty
  },
  starsPesoConversion: {
    type: Number,
    default: 0, // Ensure the field is created with a default value if empty
  },
  starPointsDeducted: {
    type: Number,
    default: 0, // Ensure the field is created with a default value if empty
  },
  copPoints: {
    type: Number,
    default: 0, // Ensure the field is created with a default value if empty
  },
  copPesoConversion: {
    type: Number,
    default: 0, // Ensure the field is created with a default value if empty
  },
  copPointsDeducted: {
    type: Number,
    default: 0, // Ensure the field is created with a default value if empty
  },
});

// Transform the output JSON to remove _id and __v
teamMemberPointSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Initialize the model
let TeamMemberPoint;

try {
  TeamMemberPoint = mongoose.model(
    "TeamMemberPoint",
    teamMemberPointSchema,
    "teamMemberPoint"
  );
} catch (error) {
  TeamMemberPoint = mongoose.model(
    "TeamMemberPoint",
    teamMemberPointSchema,
    "teamMemberPoint"
  );
}

module.exports = TeamMemberPoint;

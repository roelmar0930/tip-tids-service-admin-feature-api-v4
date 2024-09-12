const mongoose = require("mongoose");
const { formatDateToManilaUTC } = require("../utils/DateUtils");

const changeLogSchema = new mongoose.Schema({
  modelName: {
    // Name of the model (Event, Task, etc.)
    type: String,
    required: true,
  },
  documentId: {
    // ID of the document being changed
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  timestamp: {
    type: Date,
    default: formatDateToManilaUTC(new Date()),
  },
  userId: {
    // ID of the user who made the change
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  action: {
    type: String,
    required: true,
  },
});

const ChangeLog = mongoose.model("ChangeLog", changeLogSchema);

module.exports = ChangeLog;

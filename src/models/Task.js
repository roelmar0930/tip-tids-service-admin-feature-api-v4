const mongoose = require("mongoose");
const { formatDateToManilaUTC } = require("../utils/DateUtils");

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  importance: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  link: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: formatDateToManilaUTC(new Date()),
    require: true,
  },
  createdBy: {
    email: {
      type: String,
      require: true,
    },
    workdayId: {
      type: Number,
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
      type: Number,
    },
  },
});

taskSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    const lastId = await Task.findOne({}, {}, { sort: { id: -1 } });
    const nextId = lastId ? lastId.id + 1 : 1;
    doc.id = nextId;
  }
  next();
});

taskSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Task = mongoose.model("Task", taskSchema, "TASK");

module.exports = Task;

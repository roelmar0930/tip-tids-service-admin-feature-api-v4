const mongoose = require('mongoose');

let CompletedTask;

try {
  CompletedTask = mongoose.model('completedTask');
} catch (error) {
  const { Schema } = mongoose;
  const completedTaskSchema = new Schema({
    taskId: {
      type: Number
    },
    email: {
      type: String
    },
    completionDate: {
      type: Date
    }
  });

  completedTaskSchema.set('toJSON', {
    transform: (doc, ret, options) => {
      delete ret.__v;
      return ret;
    }
  });

  CompletedTask = mongoose.model('completedTask', completedTaskSchema);
}

module.exports = CompletedTask;

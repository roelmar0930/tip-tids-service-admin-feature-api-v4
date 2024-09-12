const mongoose = require('mongoose');

let TaskReminder;

try {
    TaskReminder = mongoose.model('task_reminder');
} catch (error) {
    const { Schema } = mongoose;
    const taskReminderSchema = new Schema({
        taskReminderId: {
            type: Number
        },
        title: {
            type: String
        },
        detail: {
            type: String
        },
        pictureUrl: {
            type: String
        },
        optionalInd: {
            type: String
        },
        dueDateTime: {
            type: Date
        },
        createdDate: {
            type: Date, default: Date.now
        },
        createdBy: {
            type: String
        },
        updatedDate: {
            type: Date
        },
        updatedBy: {
            type: String
        },
        importance: {
            type: String
        }
    });

    // to remove the default properties of the JSON that is not needed after POST and set the default id to eventId
    taskReminderSchema.set('toJSON', {
        transform: (doc, ret, options) => {
            ret.taskReminderId = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    TaskReminder = mongoose.model('task_reminder', taskReminderSchema);
}

module.exports = TaskReminder;
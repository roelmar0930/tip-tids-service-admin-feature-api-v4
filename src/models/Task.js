const mongoose = require('mongoose');

let Task;

try {
    Task = mongoose.model('task');
} catch (error) {
    const { Schema } = mongoose;
    const taskSchema = new Schema({
        taskId: {
            type: Number
        },
        title: {
            type: String
        },
		dueDate: {
			type: Date
		},
		details: {
            type: String
        },
		link: {
			type: String
		},
		importance: {
			type: String
		},
		createdDate: {
            type: Date
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
        name: {
            type: String
        },
        pictureUrl: {
            type: String
        },
		optionalInd: {
			type: Boolean
		},
        status: {
			type: String,
            default: 'Active'
		}
    });

	taskSchema.pre('save', async function (next) {
		const doc = this;
		if (doc.isNew) {
		  const lastTask = await Task.findOne({}, {}, { sort: { taskId: -1 } });
		  const nextTaskId = lastTask ? lastTask.taskId + 1 : 10000000;
		  doc.taskId = nextTaskId;
		}
		next();
	});

    taskSchema.set('toJSON', {
        transform: (doc, ret, options) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    Task = mongoose.model('task', taskSchema);
}

module.exports = Task;
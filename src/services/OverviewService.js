const Event = require('../models/Event');
const TaskReminder = require('../models/TaskReminder');
const TeamMember = require('../models/TeamMember');
const Task = require('../models/Task')
const CompletedTasks = require('../models/CompletedTask')

class OverviewService {

    async getUpcomingEventsCount() {
        const eventsCount = await Event.find({ status: {$in: ['Active', 'Inactive']}}).count();
        return eventsCount;
    }

    async getPendingTasksCount(email) {
        const activeTasks = await Task.find({ status: 'Active' });
        const activeTaskIds = activeTasks.map(task => task.taskId);

        const completedTasksCount = await CompletedTasks.countDocuments({
            email: email,
            taskId: { $in: activeTaskIds },
        });

        const pendingTasksCount = activeTasks.length - completedTasksCount;
        return pendingTasksCount;
    }

    async getTasksById(id) {
        const tasks = await TaskReminder.find({ createdBy: id }).sort({ dueDateTime: 1 }).limit(5);
        return tasks;
    }

    async addTask(taskBody) {
        const task = await TaskReminder.create(taskBody);
        return task;
    }

    async getEvents() {
        const events = await Event.find({ status: {$in: ['Active', 'Inactive']}}).sort({ startDate: 1 }).limit(5);
        return events;
    }

    async getTasks(email) {
        const activeTasks = await Task.find({ status: 'Active' });
        const completedTaskIds = await CompletedTasks.find({ email: email }).distinct('taskId');
        const activeAndIncompleteTasks = activeTasks.filter(task => !completedTaskIds.includes(task.taskId));
        const tasks = activeAndIncompleteTasks.sort((a, b) => a.dueDate - b.dueDate).slice(0, 5);
        return tasks;
    }

    async getTeamMemberInfoById(id) {
        const teamMember = await TeamMember.where('workdayId', id);
        return teamMember;
    }
}

module.exports = new OverviewService();

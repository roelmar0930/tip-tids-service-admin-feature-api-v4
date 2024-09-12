const Task = require("../models/Task");
const CompletedTask = require("../models/CompletedTask");
const mongoose = require("mongoose");

class TaskService {
  async getAllTasks() {
    const tasks = await Task.find();
    return tasks;
  }

  async addTask(taskBody) {
    const task = await Task.create(taskBody);
    return task;
  }

  async completeTask(taskId, email) {
    let completedTask = new CompletedTask({
      taskId: taskId,
      email: email,
      completionDate: new Date(),
    });
    completedTask.save();
    return completedTask;
  }

  async updateTaskById(taskId, taskBody) {
    const task = await Task.findOneAndUpdate({ taskId: taskId }, taskBody, {
      new: true,
      useFindAndModify: false,
    });
    return task;
  }

  async getCompletedTasks(email) {
    const completedTaskIds = await getCompletedTaskIds(email);
    const completedTasks = await Task.find({
      taskId: { $in: completedTaskIds },
    });
    return completedTasks;
  }

  async getIncompleteTasks(email) {
    const completedTaskIds = await getCompletedTaskIds(email);
    const incompleteTasks = await Task.find({
      taskId: { $nin: completedTaskIds },
    });
    return incompleteTasks;
  }

  async deleteTask(taskId, taskBody) {
    const task = await Task.findOneAndUpdate({ taskId: taskId }, taskBody, {
      new: true,
      useFindAndModify: false,
    });
    return task;
  }
}

async function getCompletedTaskIds(email) {
  const completedTasks = await CompletedTask.find({ email });
  return completedTasks.map((completedTask) => completedTask.taskId);
}

module.exports = new TaskService();

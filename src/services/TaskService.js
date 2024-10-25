const Task = require("../models/Task");
const CompletedTask = require("../models/CompletedTask");
const mongoose = require("mongoose");

class TaskService {
  async getAllTasks() {
    const tasks = await Task.find();
    return tasks;
  }
  async getTaskDetails(query) {
    try {
      const taskDetails = await Task.findOne(query);

      if (!taskDetails) {
        throw new createHttpError(404, "Task not found");
      }

      return taskDetails;
    } catch (error) {
      throw error;
    }
  }

  // async createTask(taskData) {
  //   const task = await Task.create(taskBody);
  //   return task;
  // }

  async createTask(taskData) {
    try {
      
      // Create the event object with image URL
      const task = new Task({
        ...taskData
      });

      // Save the event
      await task.save();
      console.log("Task created:", task);
      return task;
    } catch (error) {
      console.log("Error creating task:", error.message);
      throw error;
    }
  }
  // async completeTask(taskId, email) {
  //   let completedTask = new CompletedTask({
  //     taskId: taskId,
  //     email: email,
  //     completionDate: new Date(),
  //   });
  //   completedTask.save();
  //   return completedTask;
  // }

  // update similar to event update
  // async updateTaskById(taskId, taskBody) {
  //   const task = await Task.findOneAndUpdate({ taskId: taskId }, taskBody, {
  //     new: true,
  //     useFindAndModify: false,
  //   });
  //   return task;
  // }

  async updateTask(updatedDetails) {
    try {
      const task = await Task.findOne({ id: updatedDetails.id });

      if (!task) {
        throw new createHttpError(404, "Task not found");
      }
      task.set(updatedDetails);
      await task.save();

      console.log("Task updated:", task);
      return task;
    } catch (error) {
      throw error;
    }
  }

  // async getCompletedTasks(email) {
  //   const completedTaskIds = await getCompletedTaskIds(email);
  //   const completedTasks = await Task.find({
  //     taskId: { $in: completedTaskIds },
  //   });
  //   return completedTasks;
  // }

  // async getIncompleteTasks(email) {
  //   const completedTaskIds = await getCompletedTaskIds(email);
  //   const incompleteTasks = await Task.find({
  //     taskId: { $nin: completedTaskIds },
  //   });
  //   return incompleteTasks;
  // }

  async deleteTask(id, taskBody) {
    const task = await Task.findOneAndUpdate({ id }, taskBody, {
      new: true,
      useFindAndModify: false,
    });
    return task;
  }
}

// async function getCompletedTaskIds(email) {
//   const completedTasks = await CompletedTask.find({ email });
//   return completedTasks.map((completedTask) => completedTask.taskId);
// }

module.exports = new TaskService();

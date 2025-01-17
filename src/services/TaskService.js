const Task = require("../models/Task");
const logger = require("../utils/Logger");

class TaskService {
  async getAllTasks(taskQuery) {
    const tasks = await Task.find(taskQuery);
    return tasks;
  }

  async createTask(taskData) {
    try {
      
      const task = new Task({
        ...taskData
      });

      // Save the event
      await task.save();
      logger.info("Task created:" + task);
      console.log("Task created:", task);
      return task;
    } catch (error) {
      logger.error("Error creating task:" + error.message);
      console.log("Error creating task:", error.message);
      throw error;
    }
  }

  async updateTask(updatedDetails) {
    try {
      const task = await Task.findOne({ id: updatedDetails.id });

      if (!task) {
        logger.error("409 Task not found");
        throw new createHttpError(404, "Task not found");
      }
      task.set(updatedDetails);
      await task.save();

      logger.info("Task updated:" + task);
      console.log("Task updated:", task);
      return task;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(id, taskBody) {
    const task = await Task.findOneAndUpdate({ id }, taskBody, {
      new: true,
      useFindAndModify: false,
    });
    return task;
  }
}

module.exports = new TaskService();

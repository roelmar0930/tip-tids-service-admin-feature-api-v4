const mongoose = require('mongoose');
const { formatDateToUTC } = require('../utils/DateUtils');
const Task = require('../models/Task');
const TeamMemberTask = require('../models/TeamMemberTask');
const Logger = require('../utils/Logger');
const dotenv = require('dotenv');
dotenv.config();
const getConfig = require('../config/config');

async function connectToDatabase() {
  try {
    const config = await getConfig();

    await mongoose.connect(config.databaseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

  } catch (error) {
    Logger.error('Database connection error:', error);
    process.exit(1);
  }
}

async function convertTaskDates() {
  try {
    const tasks = await Task.find({});
    let updatedCount = 0;

    for (let task of tasks) {
      let needsUpdate = false;

      if (task.dueDate) {
        task.dueDate = new Date(formatDateToUTC(task.dueDate));
        needsUpdate = true;
      }

      if (task.createdAt) {
        task.createdAt = new Date(formatDateToUTC(task.createdAt));
        needsUpdate = true;
      }

      if (task.updatedAt) {
        task.updatedAt = new Date(formatDateToUTC(task.updatedAt));
        needsUpdate = true;
      }

      if (needsUpdate) {
        await task.save();
        updatedCount++;
      }
    }

    Logger.info(`Converted ${updatedCount} Task documents to UTC`);
  } catch (error) {
    Logger.error('Error converting Task dates:', error);
  }
}

async function convertTeamMemberTaskDates() {
  try {
    const teamMemberTasks = await TeamMemberTask.find({});
    let updatedCount = 0;

    for (let teamMemberTask of teamMemberTasks) {
      let needsUpdate = false;

      if (teamMemberTask.assignedDate) {
        teamMemberTask.assignedDate = new Date(formatDateToUTC(teamMemberTask.assignedDate));
        needsUpdate = true;
      }

      if (teamMemberTask.startedDate) {
        teamMemberTask.startedDate = new Date(formatDateToUTC(teamMemberTask.startedDate));
        needsUpdate = true;
      }

      if (teamMemberTask.completionDate) {
        teamMemberTask.completionDate = new Date(formatDateToUTC(teamMemberTask.completionDate));
        needsUpdate = true;
      }

      if (needsUpdate) {
        await teamMemberTask.save();
        updatedCount++;
      }
    }

    Logger.info(`Converted ${updatedCount} TeamMemberTask documents to UTC`);
  } catch (error) {
    Logger.error('Error converting TeamMemberTask dates:', error);
  }
}

async function main() {
  await connectToDatabase();
  await convertTaskDates();
  await convertTeamMemberTaskDates();
  await mongoose.connection.close();
}

main().catch(error => {
  Logger.error('Script execution error:', error);
  process.exit(1);
});

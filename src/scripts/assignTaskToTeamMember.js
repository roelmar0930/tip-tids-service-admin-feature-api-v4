const mongoose = require('mongoose');
const config = require('../config/config');
const Task = require('../models/Task');
const TeamMemberTask = require('../models/TeamMemberTask');
const TeamMember = require('../models/TeamMember');

async function assignTaskToAllTeamMembers() {
  try {
    // Get command line arguments
    const args = process.argv.slice(2);
    if (args.length !== 1) {
      logger.error('Usage: node assignTaskToTeamMember.js <taskId>');
      process.exit(1);
    }

    const [taskId] = args;

    // Connect to MongoDB
    await mongoose.connect(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');

    // Check if the task exists
    const task = await Task.findOne({ id: parseInt(taskId) });
    if (!task) {
      logger.error('Task does not exist');
      process.exit(1);
    }

    // Get all team members
    const teamMembers = await TeamMember.find({});
    if (teamMembers.length === 0) {
      logger.error('No team members found');
      process.exit(1);
    }

    // Assign task to each team member
    for (const teamMember of teamMembers) {
      const existingTask = await TeamMemberTask.findOne({
        taskId: parseInt(taskId),
        teamMemberWorkdayId: teamMember.workdayId,
        teamMemberEmail: teamMember.workEmailAddress
      });

      if (existingTask) {
        logger.info(`Task already assigned to team member: ${teamMember.workEmailAddress}`);
      } else {
        const newTaskAssignment = new TeamMemberTask({
          taskId: parseInt(taskId),
          teamMemberWorkdayId: teamMember.workdayId,
          teamMemberEmail: teamMember.workEmailAddress,
          assignedDate: task.createdAt,
        });

        await newTaskAssignment.save();
        logger.info(`Task assigned successfully to: ${teamMember.workEmailAddress}`);
      }
    }

  } catch (error) {
    logger.error(`Error assigning tasks: ${error.message}`);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  }
}

// Run the script
assignTaskToAllTeamMembers();

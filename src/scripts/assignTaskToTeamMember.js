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
      console.error('Usage: node assignTaskToTeamMember.js <taskId>');
      process.exit(1);
    }

    const [taskId] = args;

    // Connect to MongoDB
    await mongoose.connect(config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Check if the task exists
    const task = await Task.findOne({ id: parseInt(taskId) });
    if (!task) {
      console.error('Task does not exist');
      process.exit(1);
    }

    // Get all team members
    const teamMembers = await TeamMember.find({});
    if (teamMembers.length === 0) {
      console.error('No team members found');
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
        console.log(`Task already assigned to team member: ${teamMember.workEmailAddress}`);
      } else {
        const newTaskAssignment = new TeamMemberTask({
          taskId: parseInt(taskId),
          teamMemberWorkdayId: teamMember.workdayId,
          teamMemberEmail: teamMember.workEmailAddress,
          assignedDate: task.createdAt,
        });

        await newTaskAssignment.save();
        console.log(`Task assigned successfully to: ${teamMember.workEmailAddress}`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
assignTaskToAllTeamMembers();

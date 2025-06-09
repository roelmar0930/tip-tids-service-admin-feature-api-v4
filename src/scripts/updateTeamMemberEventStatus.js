const mongoose = require('mongoose');
const fs = require('fs');
const readline = require('readline');
const TeamMemberEvent = require('../models/TeamMemberEvent');
const logger = require('../utils/Logger');

const URI = "mongodb://localhost:27017/tip";

async function updateTeamMemberEventStatus(csvFilePath, eventId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('Connected to MongoDB');

    // Read CSV file line by line
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let lineCount = 0;
    let updatedCount = 0;

    for await (const line of rl) {
      if (lineCount === 0) {
        // Skip header
        lineCount++;
        continue;
      }

      const [workdayId] = line.split(',');
      const result = await TeamMemberEvent.updateMany(
        { 
          teamMemberWorkdayId: workdayId,
          eventId: parseInt(eventId),
          status: "unregistered"
        },
        { 
          $set: { status: "registered" } 
        }
      );
      updatedCount += result.modifiedCount;
      lineCount++;
    }

    logger.info(`Processed ${lineCount - 1} records from CSV`);
    logger.info(`Updated ${updatedCount} TeamMemberEvent entries`);

  } catch (error) {
    logger.error(`Error updating TeamMemberEvent status: ${error.message}`);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  }
}

// Check if CSV file path and eventId are provided as command-line arguments
const csvFilePath = process.argv[2];
const eventId = process.argv[3];
if (!csvFilePath || !eventId) {
  logger.error('Please provide the CSV file path and eventId as command-line arguments');
  process.exit(1);
}

// Run the script
updateTeamMemberEventStatus(csvFilePath, eventId);

const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const TeamRoster = require('../models/TeamMember'); // Adjust the path to your model

const uri = ''; // Replace with your MongoDB URI

// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    const filePath = process.argv[2];
    if (!filePath) {
      console.error('Please provide a CSV file path.');
      process.exit(1);
    }
    updateCollectionFromCSV(filePath);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Function to update or add a team member
async function updateTeamMember(member, stats) {
  const existingMember = await TeamRoster.findOne({ workEmailAddress: member.workEmailAddress, workdayId: member.workdayId });
  if (existingMember) {
    const updatedMember = { ...member };
    if (updatedMember.intermmediateManager) {
      updatedMember.intermmediateManager = updatedMember.intermmediateManager;
      delete updatedMember.intermmediateManagerName;
    }
    if (updatedMember.yearOfService) {
      updatedMember.yearOfService = updatedMember.yearOfService;
      delete updatedMember.yearsOfService;
    }
    await TeamRoster.updateOne(
      { workEmailAddress: member.workEmailAddress, workdayId: member.workdayId },
      { $set: updatedMember }
    );

    stats.updated++;
  } else {
    await TeamRoster.create(member);
    stats.added++;
  }
}

// Function to update the collection from CSV
async function updateCollectionFromCSV(filePath) {
  console.log('Starting update from CSV...');
  const results = [];
  const stats = { updated: 0, added: 0 };
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        const { workEmailAddress, workdayId } = row;
        if (workEmailAddress && workdayId) {
          await updateTeamMember(row, stats);
        } else {
          console.warn(`Missing workEmailAddress or workdayId for row: ${JSON.stringify(row)}`);
        }
      }
      console.log(`Update from CSV completed. ${stats.updated} records updated, ${stats.added} records added.`);
      mongoose.disconnect();
    });
}

module.exports = {
  // ...existing exports...
  updateCollectionFromCSV
};

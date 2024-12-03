const mongoose = require("mongoose");
const TeamMember = require("../models/TeamMember"); // Adjust the path as necessary

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/tip", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    updateRoles(); // Run the update function after connection
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function updateRoles() {
  try {
    // Update role to 'teamManager' if jobProfile contains 'manage'
    const managerResult = await TeamMember.updateMany(
      { jobProfile: { $regex: "manager", $options: "i" } }, // Case-insensitive regex
      { $set: { role: "teamManager" } }
    );
    console.log(`${managerResult.modifiedCount} documents updated to teamManager`);

    // Update role to 'teamLeader' if jobProfile contains 'leader'
    const leaderResult = await TeamMember.updateMany(
      { 
        jobProfile: { 
          $regex: "leader", 
          $options: "i" 
        },
      }, 
      { $set: { role: "teamLeader" } }
    );
    console.log(`${leaderResult.modifiedCount} documents updated to teamLeader`);

    const pocResult = await TeamMember.updateMany(
      {
        jobProfile: { 
          $regex: "General Administration Analyst", 
          $options: "i" 
        }
      },
      { $set: { role: "admin" } }
    );
    console.log(`${pocResult.modifiedCount} documents updated to admin`);


    // Set role to 'teamMember' for all remaining records
    const remainingResult = await TeamMember.updateMany(
      {
        jobProfile: { 
          $not: { $regex: "(manager|leader|General Administration Analyst)", $options: "i" } // Exclude 'manage' and 'leader'
        }
      },
      { $set: { role: "teamMember" } }
    );
    console.log(`${remainingResult.modifiedCount} documents updated to teamMember`);
  } catch (error) {
    console.error("Error updating roles:", error);
  } finally {
    mongoose.disconnect();
  }
}

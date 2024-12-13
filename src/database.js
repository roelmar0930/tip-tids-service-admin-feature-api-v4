const mongoose = require("mongoose");
const getConfig = require("./config/config"); // Import the async config function

async function initializeDatabase() {
  try {
    // Get the configuration which includes the database URI
    const config = await getConfig();
    const databaseUri = config.databaseUri;

    // Connect to MongoDB using Mongoose
    await mongoose.connect(databaseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MONGOOSE: connected");
    console.log("Collections:");
    mongoose.connection.db.listCollections().toArray((err, names) => {
      if (err) {
        console.log("Error listing collections:", err);
      } else {
        names.forEach((e) => {
          console.log("-->", e.name); // Log the collection names
        });
      }
    });

  } catch (error) {
    console.error("Error during database initialization:", error.message);
    process.exit(1); // Exit if database connection fails
  }
}

// Call the initialization function to connect to the database
initializeDatabase();

// Event listener for connection closed
mongoose.connection.on("close", () => {
  console.log("MONGOOSE: connection closed");
});

// Event listener for connection errors
mongoose.connection.on("error", (error) => {
  console.log("MONGOOSE: connection error", error);
});

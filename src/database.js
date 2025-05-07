const mongoose = require("mongoose");
const getConfig = require("./config/config"); // Import the async config function
const logger = require("./utils/Logger");

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

    logger.info("MongoDB connected successfully");
    mongoose.connection.db.listCollections().toArray((err, names) => {
      if (err) {
        logger.error(`Error listing collections: ${err.message}`);
      }
    });

  } catch (error) {
    logger.error(`Database initialization failed: ${error.message}`);
    process.exit(1); // Exit if database connection fails
  }
}

// Call the initialization function to connect to the database
initializeDatabase();

// Event listener for connection closed
mongoose.connection.on("close", () => {
  logger.info("MongoDB connection closed");
});

// Event listener for connection errors
mongoose.connection.on("error", (error) => {
  logger.error(`MongoDB connection error: ${error.message}`);
});

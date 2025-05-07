const mongoose = require("mongoose");
const getConfig = require("./config/config");
const logger = require("./utils/Logger");

// Create a promise that resolves when the database is connected
const databaseConnection = (async () => {
  try {
    // Get the configuration which includes the database URI
    const config = await getConfig();
    const databaseUri = config.databaseUri;

    // Connect to MongoDB using Mongoose
    await mongoose.connect(databaseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });

    logger.info("MongoDB connected successfully");

    // Set up event listeners
    mongoose.connection.on("close", () => {
      logger.info("MongoDB connection closed");
    });

    mongoose.connection.on("error", (error) => {
      logger.error(`MongoDB connection error: ${error.message}`);
    });

    // List collections after successful connection
    const collections = await mongoose.connection.db.listCollections().toArray();
    logger.info(`Available collections: ${collections.map(c => c.name).join(', ')}`);

    return mongoose.connection;
  } catch (error) {
    logger.error(`Database initialization failed: ${error.message}`);
    throw error; // Let the error propagate to be handled by the app
  }
})();

module.exports = databaseConnection;

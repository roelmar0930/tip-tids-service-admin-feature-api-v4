const { getSecret } = require("../utils/SecretManager");
const logger = require("../utils/Logger");

// Main function to initialize secrets
async function initializeSecrets() {
  try {
    let databaseUri;

    // Handle different environments (production, testing, local)
    if (process.env.NODE_ENV === "production") {
      databaseUri = await getSecret("DATABASE_URI_PR_V4"); // Fetch production secret
    } else if (process.env.NODE_ENV === "testing") {
      databaseUri = await getSecret("DATABASE_URI_QA_V4"); // Fetch testing secret
    } else {
      databaseUri = process.env.DATABASE_URI_LOCAL || "mongodb://127.0.0.1:27017/tip";
    }

    // Inject the secret or local variable into process.env
    process.env.DATABASE_URI = databaseUri;

    logger.info("Configuration loaded successfully");

  } catch (error) {
    // Handle errors and log them
    logger.error(`Configuration initialization failed: ${error.message}`);
    process.exit(1); // Exit if secret loading fails
  }
}

// Ensure secrets are initialized before exporting the configuration
async function getConfig() {
  await initializeSecrets(); // Wait for the secrets to be initialized
  return {
    databaseUri: process.env.DATABASE_URI, // Retun trhe database URI from process.env
  };
}

module.exports = getConfig; // Export the async function that returns the config

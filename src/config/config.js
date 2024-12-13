const { getSecret } = require("../utils/SecretManager");

// Main function to initialize secrets
async function initializeSecrets() {
  try {
    let databaseUri;

    // Handle different environments (production, testing, local)
    if (process.env.NODE_ENV === "production") {
      console.log("Fetching production secret");
      databaseUri = await getSecret("DATABASE_URI_PR_V4"); // Fetch production secret
    } else if (process.env.NODE_ENV === "testing") {
      console.log("Fetching testing secret");
      databaseUri = await getSecret("DATABASE_URI_QA_V4"); // Fetch testing secret
    } else {
      console.log("Using local database URI");
      databaseUri = process.env.DATABASE_URI_LOCAL || "mongodb://127.0.0.1:27017/tip";
    }

    // Inject the secret or local variable into process.env
    process.env.DATABASE_URI = databaseUri;

    console.log("Secrets loaded successfully");
    // For debugging purposes: Log the database URI (be cautious about sensitive data)
    console.log("Database URI:", process.env.DATABASE_URI);

  } catch (error) {
    // Handle errors and log them
    console.error("Error during initialization:", error.message);
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

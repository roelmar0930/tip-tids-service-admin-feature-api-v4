const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const logger = require('./Logger');

// Create a client
logger.info('Initializing Secret Manager client');
const client = new SecretManagerServiceClient();

// Function to fetch the latest enabled secret
async function getSecret(secretName) {
  const projectId = process.env.GCP_PROJECT_ID || 'engagement-app-tids';
  const name = `projects/${projectId}/secrets/${secretName}`;

  try {
    // List all versions of the secret
    const [versions] = await client.listSecretVersions({ parent: name });

    // Find the latest enabled version (not disabled)
    const latestEnabledVersion = versions
      .filter(version => version.state === 'ENABLED')
      .sort((a, b) => b.createTime.seconds - a.createTime.seconds)[0]; // Sort by createTime to get the latest

    if (!latestEnabledVersion) {
      throw new Error(`No enabled versions found for secret: ${secretName}`);
    }
    const latestVersionName = latestEnabledVersion.name;
    
    // Fetch the secret version data
    const [versionResponse] = await client.accessSecretVersion({ name: latestVersionName });
    const secretData = versionResponse.payload.data.toString('utf8');

    return secretData; // Return the fetched secret data
  } catch (err) {
    logger.error(`Failed to access secret ${secretName}: ${err.message}`);
    logger.error(`Project ID: ${projectId}`);
    logger.error(`Full error: ${JSON.stringify(err)}`);
    throw new Error(`Error fetching secret: ${secretName}`);
  }
}

module.exports = {
  getSecret,
};

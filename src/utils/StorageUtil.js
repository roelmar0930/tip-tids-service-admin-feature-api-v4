require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const keyFilePath = path.resolve(__dirname, "../engagementAppKey.json");

const storage = new Storage({
  projectId: "engagement-app-tids",
  keyFilename: keyFilePath,
});

const bucket = storage.bucket(process.env.BUCKET_NAME);

module.exports = { storage, bucket };

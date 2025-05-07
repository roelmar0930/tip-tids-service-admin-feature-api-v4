const { bucket } = require("../utils/StorageUtil");
const createHttpError = require("http-errors");
const logger = require("../utils/Logger");

class ImageService {
  async uploadImage(imageBuffer, fileName) {
    try {
      const file = bucket.file(fileName);
      await file.save(imageBuffer);
    } catch (error) {
      throw error;
    }
  }

  async deleteImage(fileName) {
    try {
      const file = bucket.file(fileName);

      // Check if the file exists
      const [exists] = await file.exists();
      if (!exists) {
        logger.info(`Image not found: ${fileName}`);
        return;
      }

      // File exists, proceed with deletion
      await file.delete();
      logger.info(`Image successfully deleted: ${fileName}`);
    } catch (error) {
      logger.error(`Error deleting image: ${error.message}`);
      throw error; // Re-throw the error if needed
    }
  }

  async getSignedUrl(query) {
    try {
      const file = bucket.file(
        `${query.fileType}/${process.env.NODE_ENV}/${query.moduleName}/${query.fileName}`
      );

      const [exists] = await file.exists();
      if (!exists) {
        logger.error(`Image not found: ${query.fileName}`);
        throw new createHttpError(404, `Image not found: ${query.fileName}`);
      }

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24, // URL expires in 24 hours
      });

      return url;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ImageService();

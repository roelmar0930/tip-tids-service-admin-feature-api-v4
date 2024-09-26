const { bucket } = require("../utils/StorageUtil");
const createHttpError = require("http-errors");

class ImageService {
  async uploadImage(imageBuffer, fileName) {
    try {
      console.log(
        "Uploading image:",
        fileName,
        "Buffer size:",
        imageBuffer.length
      );
      const file = bucket.file(fileName);
      await file.save(imageBuffer);
    } catch (error) {
      throw error;
    }
  }

  async deleteImage(fileName) {
    try {
      console.log("Checking for image:", fileName);
      const file = bucket.file(fileName);

      // Check if the file exists
      const [exists] = await file.exists();
      if (!exists) {
        console.log("Image not found:", fileName);
        return;
      }

      // File exists, proceed with deletion
      console.log("Deleting image:", fileName);
      await file.delete();
      console.log("Image successfully deleted:", fileName);
    } catch (error) {
      console.error("Error deleting image:", error.message);
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

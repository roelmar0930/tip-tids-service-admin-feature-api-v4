const mongoose = require("mongoose");
const Event = require("../models/Event"); // Replace with your model path

// Mock of the generateUniqueCode function
const generateUniqueCode = (title) => {
  if (!title) {
    return "";
  }

  // Generate a unique hash and ID
  const generateHash = (title) => {
    // Example hash function (you should use your actual hash function here)
    return title
      .split("")
      .map((char) => char.charCodeAt(0).toString(16))
      .join("");
  };
  const generateUniqueId = () => Math.random().toString(36).substring(2, 6);

  const hash = generateHash(title);
  const uniqueCode = hash.substring(0, 4);
  const year = new Date().getFullYear();
  const uniqueId = generateUniqueId();

  return `${uniqueCode}-${year}-${uniqueId}`;
};

async function updateRegistrationCodes() {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/yourDatabaseName", // Replace with your MongoDB URI
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false, // Add this line
      }
    );

    const docs = await Event.find({
      registrationCode: { $in: ["", null, undefined] },
    });

    logger.info(`Found ${docs.length} documents to update`);

    for (const doc of docs) {
      if (!doc.title) {
        logger.warn(`Skipping document with ID ${doc._id} because title is missing`);
        continue;
      }

      const newCode = generateUniqueCode(doc.title);

      logger.info(`Processing document with ID ${doc._id}`);
      logger.info(`Event Title: ${doc.title}`);
      logger.info(`Old registrationCode: ${doc.registrationCode}`);
      logger.info(`New registrationCode: ${newCode}`);

      const result = await Event.findByIdAndUpdate(
        doc._id,
        { $set: { registrationCode: newCode } },
        { new: true }
      );

      logger.info(`Update result for document ${doc._id}: ${result ? "Updated" : "Not Found"}`);
    }

    logger.info("Update complete");
  } catch (error) {
    logger.error(`Error updating registration codes: ${error.message}`);
  } finally {
    mongoose.connection.close();
  }
}

updateRegistrationCodes();

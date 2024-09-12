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
      "mongodb://3AUserQA:3ngag3m3ntAppQA@34.87.164.24:27017/tip",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false, // Add this line
      }
    );

    const docs = await Event.find({
      registrationCode: { $in: ["", null, undefined] },
    });

    console.log(`Found ${docs.length} documents to update`);

    for (const doc of docs) {
      if (!doc.title) {
        console.log(
          `Skipping document with ID ${doc._id} because title is missing`
        );
        continue;
      }

      const newCode = generateUniqueCode(doc.title);

      console.log(`Processing document with ID ${doc._id}`);
      console.log(`Event Title: ${doc.title}`);
      console.log(`Old registrationCode: ${doc.registrationCode}`);
      console.log(`New registrationCode: ${newCode}`);

      const result = await Event.findByIdAndUpdate(
        doc._id,
        { $set: { registrationCode: newCode } },
        { new: true }
      );

      console.log(
        `Update result for document ${doc._id}: ${
          result ? "Updated" : "Not Found"
        }`
      );
    }

    console.log("Update complete");
  } catch (error) {
    console.error("Error updating registration codes:", error);
  } finally {
    mongoose.connection.close();
  }
}

updateRegistrationCodes();

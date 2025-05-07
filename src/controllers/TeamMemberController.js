const TeamMemberService = require("../services/TeamMemberService");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

// Configure multer to store files in uploads directory
const upload = multer({ dest: "uploads/" });

const getAllTeamMember = async (req, res, next) => {
  try {
    const teamMembers = await TeamMemberService.getAllTeamMember(req.query, req.timeZone);
    res.status(200).json(teamMembers);
  } catch (error) {
    next(error);
  }
};

const getTeamMember = async (req, res, next) => {
  try {
    const teamMember = await TeamMemberService.getTeamMember(req.query, req.timeZone);
    res.status(200).json(teamMember);
  } catch (error) {
    next(error);
  }
};

const addEvent = async (req, res, next) => {
  try {
    const teamMemberEvent = await TeamMemberService.addEvent(
      req.query,
      req.body,
      req.timeZone
    );
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const teamMemberEvent = await TeamMemberService.updateEvent(
      req.query,
      req.body,
      req.timeZone
    );
    res.status(200).json(teamMemberEvent);
  } catch (error) {
    next(error);
  }
};

const bulkSyncTeamMembers = async (req, res, next) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const { updatedCount, addedCount, terminatedCount } = await TeamMemberService.bulkSyncTeamMembers(results);
          // Clean up: remove the temporary file after processing
          fs.unlinkSync(req.file.path);
          res.status(200).json({
            message: "Team members synchronized successfully",
            updatedCount,
            addedCount,
            terminatedCount
          });
        } catch (error) {
          next(error);
        }
      });
  });
};

module.exports = {
  getAllTeamMember,
  getTeamMember,
  addEvent,
  updateEvent,
  bulkSyncTeamMembers,
};

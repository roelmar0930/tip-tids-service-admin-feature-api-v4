const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.json({
    message: "Get resource",
  });
});

router.post("/", function (req, res, next) {
  res.json({
    message: "Post resource",
  });
});

router.patch("/", function (req, res, next) {
  res.json({
    message: "Patch resource",
  });
});

router.delete("/", function (req, res, next) {
  res.json({
    message: "Delete resource",
  });
});

module.exports = router;

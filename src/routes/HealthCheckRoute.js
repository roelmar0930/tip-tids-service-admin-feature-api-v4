const express = require("express");
const { checkStatus } = require("../controllers/HealthCheckController");
const router = express.Router();

router.get("/status", checkStatus);

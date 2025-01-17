const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./utils/Logger");
const cors = require("cors");
require("./database");

// Middleware
const ErrorHandler = require("./middleware/ErrorHandler");

// Routes
const IndexRouter = require("./routes/IndexRoute");
const GoogleRouter = require("./routes/GoogleRoute");
const EventsRouter = require("./routes/EventsRoute");
const TaskRouter = require("./routes/TaskRoute");
const ImageRoute = require("./routes/ImageRoute");
const TeamMemberPointsRouter = require("./routes/TeamMemberPointsRoute");
const TeamMemberRouter = require("./routes/TeamMemberRoute");
const ScheduleJobs = require("./schedule/ScheduleJobs");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Set up Morgan for HTTP request logging
// Morgan logs will be passed to Winston logger
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim());  // Use Winston's logger for HTTP logs
    }
  }
}));

app.use("/", IndexRouter);
app.use("/google", GoogleRouter);
app.use("/events", EventsRouter);
app.use("/task", TaskRouter);
app.use("/image", ImageRoute);
app.use("/teamMember", TeamMemberRouter);
app.use("/teamMemberPoints", TeamMemberPointsRouter);

app.get("/status", (req, res) => {
  // You can perform any checks or logic here to determine the health status
  const isHealthy = true; // Example health check logic

  if (isHealthy) {
    logger.info('Health check OK');
    res.status(200).json({ status: "ok" }); // Respond with HTTP 200 and a JSON indicating health
  } else {
    logger.info('Health check FAILED');
    res.status(500).json({ status: "error" }); // Respond with HTTP 500 if not healthy
  }
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "Not Found"));
});

app.use(ErrorHandler);

ScheduleJobs();

module.exports = app;

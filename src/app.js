const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("./database");
const moment = require("moment-timezone");

// Middleware
const ErrorHandler = require("./middleware/ErrorHandler");

// Routes
const IndexRouter = require("./routes/IndexRoute");
const featuresRouter = require("./routes/FeaturesRoute");
const overviewRouter = require("./routes/OverviewRoute");
const eventsRouter = require("./routes/EventsRoute");
const orderRouter = require("./routes/OrderRoute");
const taskRouter = require("./routes/TaskRoute");
const googleRouter = require("./routes/GoogleRoute");
const googleRouterV4 = require("./routes/GoogleV4Route");
const TeamMemberPointsRouter = require("./routes/TeamMemberPointsRoute");
const teamMemberRouter = require("./routes/TeamMemberRoute");
const TeamRosterRoute = require("./routes/TeamRosterRoute");
const ScheduleJobs = require("./schedule/ScheduleJobs");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", IndexRouter);
app.use("/features", featuresRouter);
app.use("/overview", overviewRouter);
app.use("/events", eventsRouter);
app.use("/order", orderRouter);
app.use("/task", taskRouter);
app.use("/teamMemberPoints", TeamMemberPointsRouter);
app.use("/teamMember", teamMemberRouter);
app.use("/teamRoster", TeamRosterRoute);
app.use("/google", googleRouter);
app.use("/v4/google", googleRouterV4);

app.get("/status", (req, res) => {
  // You can perform any checks or logic here to determine the health status
  const isHealthy = true; // Example health check logic

  if (isHealthy) {
    res.status(200).json({ status: "ok" }); // Respond with HTTP 200 and a JSON indicating health
  } else {
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

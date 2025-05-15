const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

// Local imports
const logger = require('./utils/Logger');
const swaggerSpecs = require('./config/swaggerConfig');
const ErrorHandler = require('./middleware/ErrorHandler');
const ScheduleJobs = require('./schedule/ScheduleJobs');

// Routes
const IndexRouter = require('./routes/IndexRoute');
const GoogleRouter = require('./routes/GoogleRoute');
const EventsRouter = require('./routes/EventsRoute');
const TaskRouter = require('./routes/TaskRoute');
const ImageRoute = require('./routes/ImageRoute');
const TeamMemberPointsRouter = require('./routes/TeamMemberPointsRoute');
const TeamMemberRouter = require('./routes/TeamMemberRoute');
const ReportRouter = require('./routes/ReportRoute');
const HealthCheckRouter = require('./routes/HealthCheckRoute');

async function initializeApp() {
  try {
    // Wait for database initialization
    await require('./database');
    logger.info('Database initialization completed');

    const app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Set up Morgan for HTTP request logging
    app.use(morgan('combined', {
      stream: {
        write: (message) => {
          logger.info(message.trim());  // Use Winston's logger for HTTP logs
        }
      }
    }));

    // Routes
    app.use('/', IndexRouter);
    app.use('/google', GoogleRouter);
    app.use('/events', EventsRouter);
    app.use('/task', TaskRouter);
    app.use('/image', ImageRoute);
    app.use('/teamMember', TeamMemberRouter);
    app.use('/teamMemberPoints', TeamMemberPointsRouter);
    app.use('/report', ReportRouter);
    app.use('/status', HealthCheckRouter);

    // Swagger UI route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

    // Catch 404 and forward to error handler
    app.use((req, res, next) => {
      next(createError(404, 'Not Found'));
    });

    app.use(ErrorHandler);

    ScheduleJobs();

    return app;
  } catch (error) {
    logger.error(`Failed to initialize application: ${error.message}`);
    process.exit(1);
  }
}

module.exports = initializeApp();

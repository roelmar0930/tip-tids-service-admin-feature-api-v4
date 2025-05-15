const winston = require('winston');

// Create the logger
const logger = winston.createLogger({
  level: 'info', // Set the default log level (can be adjusted as needed)
    format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
    })
),
transports: [
    new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),  // Adds colors to console output
        winston.format.simple()     // Simplifies the output in the console
    )
    }),
    new winston.transports.File({ filename: 'logs/app.log' }) // Logs to file
],
});

logger.exceptions.handle(
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'logs/exceptions.log' })
);
logger.rejections.handle(
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'logs/rejections.log' })
);

// Export the logger
module.exports = logger;

const moment = require('moment-timezone');

module.exports = function timeZone(req, res, next) {
  // Get timezone from x-timezone header
  let timeZone = req.headers['x-timezone'];

  // If no timezone in header, default to UTC
  if (!timeZone || !moment.tz.zone(timeZone)) {
    timeZone = 'UTC';
  }

  req.timeZone = timeZone;
  next();
};

const moment = require('moment-timezone');
const geoip = require('geoip-lite');

module.exports = function timeZone(req, res, next) {
  // Get timezone from query param if provided
  let timeZone = req.query.timeZone;

  if (!timeZone) {
    // If no timezone in query, try to guess based on IP
    const ip = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    
    if (geo && geo.timezone) {
      timeZone = geo.timezone;
    } else {
      // If we can't determine the timezone, use the server's local timezone
      timeZone = moment.tz.guess();
    }
  }

  // Validate the timezone
  if (!moment.tz.zone(timeZone)) {
    timeZone = 'UTC';
  }

  req.timeZone = timeZone;
  next();
};

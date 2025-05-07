const moment = require('moment-timezone');

const formatDateToUTC = (formattedDate) => {
  return moment(formattedDate).utc().format();
};

const formatDateToManilaUTC = (dateInput) => {
  return moment(dateInput).tz('Asia/Manila').utc().format();
};

const convertToTimezone = (date, timezone) => {
  return moment(date).tz(timezone).format();
};

module.exports = { formatDateToManilaUTC, formatDateToUTC, convertToTimezone };

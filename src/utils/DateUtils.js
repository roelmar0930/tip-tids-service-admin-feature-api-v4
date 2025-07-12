const moment = require('moment-timezone');

const formatDateToUTC = (formattedDate) => {
  return moment(formattedDate).utc().format();
};

const formatDateToManilaUTC = (dateInput) => {
  return moment(dateInput).tz('Asia/Manila').utc().format();
};

const convertFromManilaUTCToUTC = (manilaUTCDate) => {
  // Subtract 8 hours from the input date to convert from Manila UTC to plain UTC
  return moment(manilaUTCDate).subtract(8, 'hours').utc().format();
};

const convertToTimezone = (date, timezone) => {
  return moment(date).tz(timezone).format();
};

module.exports = { 
  formatDateToManilaUTC, 
  formatDateToUTC, 
  convertToTimezone,
  convertFromManilaUTCToUTC 
};

const formatDateToUTC = (formattedDate) => {
  const date = new Date(formattedDate);
  const utcDate = new Date(date.getTime() - 8 * 60 * 60 * 1000);
  const utcString = utcDate.toISOString();
  return utcString;
};

const formatDateToManilaUTC = (dateInput) => {
  const date = new Date(dateInput);
  const manilaDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const utcString = manilaDate.toISOString();
  return utcString;
};

module.exports = { formatDateToManilaUTC, formatDateToUTC };

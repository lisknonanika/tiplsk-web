const dateformat = require('dateformat');

/**
 * Check Empty
 */
module.exports.isEmpty = (val) => {
  return val == null || val.length === 0 || JSON.stringify(val) === "{}";
}

/**
 * Get Formated DateTime
 */
module.exports.formatDate = (val, fmt) => {
  return dateformat(val, fmt);
}

/**
 * Get History Type & Name
 */
module.exports.getTypeAndName = (val, nm) => {
  let type = 'Unknown';
  if (val === 0) type = `Sender:${nm}`;
  else if (val === 1) type = `Recipient:${nm}`;
  else if (val === 2) type = 'Fee';
  return type;
}
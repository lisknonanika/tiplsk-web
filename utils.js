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
module.exports.formatNumber = (val) => {
  const formatter = new Intl.NumberFormat('ja-JP');
  const nums = val.split('.');
  if (nums.length > 1) return `${formatter.format(nums[0])}.${nums[1]}`;
  else return formatter.format(val);
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
  if (val === 0) type = `${nm}`;
  else if (val === 1) type = `${nm}`;
  else if (val === 2) type = 'Transaction Fee';
  return type;
}
'use strict';

const R = require('ramda');
const __ = R.__;

const secsToMsecs = R.multiply(1000);
const minsToMsecs = R.compose(secsToMsecs, R.multiply(60));
const hoursToMsecs = R.compose(minsToMsecs, R.multiply(60));

const WORK_HOUR_START_MSECS = hoursToMsecs(9);
const WORK_HOUR_END_MSECS = hoursToMsecs(17);

/**
 * @param {number} timestamp a date timestamp
 * @return {boolean} true if the specified date timestamp is a working day, otherwise false
 */
const isWorkingDay = R.compose(
  R.both(R.gt(__, 0), R.lt(__, 6)),
  getUtcDay,
  timestampToDate
);

/**
 * @param {number} timestamp a date timestamp
 */
const isWorkingHour = R.compose(
  R.both(R.gte(__, WORK_HOUR_START_MSECS), R.lte(__, WORK_HOUR_END_MSECS)),
  getUtcTime,
  timestampToDate
);

/**
 * @param {number} date a date timestamp
 */
const isValidSubmitDate = R.both(isWorkingDay, isWorkingHour);

module.exports = {
  calculateDueDate,
  getUtcDay,
  getUtcTime,
  hoursToMsecs,
  // isValidSubmitDate,
  isWorkingDay,
  isWorkingHour,
  minsToMsecs,
  secsToMsecs,
  timestampToDate,
};

/**
 * @param {number} submitTimestamp the submit date in timestamp
 * @param {number} turnaroundTime the turnaround time in working hours
 * @throws {Error}
 * @return {number} the due date timestamp calculated from the specified parameters
 */
function calculateDueDate(submitTimestamp, turnaroundTime) {
  // throw new Error('Invalid submitTimestamp parameter. Submit date should be a working day (Mon to Fri, 9:00 to 17:00)')
}

/**
 * @param {number} timestamp a date timestamp
 * @return {Date} new date obj init with the specified timestamp
 */
function timestampToDate(timestamp) {
  return new Date(timestamp);
}

/**
 * @date {Date} date
 * @return {number} the day of the week of the specified date
 */
function getUtcDay(date) {
  return date.getUTCDay();
}

/**
 * @date {Date} date
 * @return {number} the time part of the specified date in milliseconds
 */
function getUtcTime(date) {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const msecs = date.getUTCMilliseconds();
  return msecs + secsToMsecs(seconds) + minsToMsecs(minutes) + hoursToMsecs(hours);
}

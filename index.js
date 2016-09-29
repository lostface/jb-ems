'use strict';

const R = require('ramda');

/**
 * @param {number} date a date timestamp
 */
const isValidSubmitDate = R.both(isWorkingDay, isWorkingHour);

module.exports = {
  calculateDueDate,
  getUtcDay,
  // isValidSubmitDate,
  isWorkingDay,
  // isWorkingHour,
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
 */
function isWorkingDay(timestamp) {
  const day = new Date(timestamp).getUTCDay();
  // the first day is Sunday
  return day > 0 && day < 6;
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

}

/**
 * @param {number} timestamp a date timestamp
 */
function isWorkingHour(timestamp) {

}

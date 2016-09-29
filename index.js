'use strict';

const R = require('ramda');

/**
 * @param {number} date a date timestamp
 */
const isValidSubmitDate = R.both(isWorkingDay, isWorkingHour);

module.exports = {
  calculateDueDate,
  // isValidSubmitDate,
  isWorkingDay,
  // isWorkingHour,
};

/**
 * @param {number} submitDate the submit date in timestamp
 * @param {number} turnaroundTime the turnaround time in working hours
 * @throws {Error}
 * @return {number} the due date calculated from the specified submitDate and turnaroundTime
 */
function calculateDueDate(submitDate, turnaroundTime) {
  // throw new Error('Invalid submitDate parameter. Submit date should be a working day (Mon to Fri, 9:00 to 17:00)')
}

/**
 * @param {number} date a date timestamp
 */
function isWorkingDay(date) {
  const day = new Date(date).getDay();
  // the first day is Sunday
  return day > 0 && day < 6;
}

/**
 * @param {number} date a date timestamp
 */
function isWorkingHour(date) {

}

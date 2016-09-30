'use strict';

const R = require('ramda');
const __ = R.__;

const secsToMsecs = R.multiply(1000);
const minsToMsecs = R.compose(secsToMsecs, R.multiply(60));
const hoursToMsecs = R.compose(minsToMsecs, R.multiply(60));

const DAY_OF_WEEK_FRIDAY = 5;
const DAY_OF_WEEK_SATURDAY = 6;
const NUM_WORK_DAYS = 5;
const WORK_HOUR_START_MSECS = hoursToMsecs(9);
const WORK_HOUR_END_MSECS = hoursToMsecs(17);
const WORK_HOURS_PER_DAY = 8;

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
 * @param {number} timestamp a date timestamp
 * @return {boolean} true if the specified date is on a working day in a working hour otherwise false
 */
const isValidSubmitDate = R.both(isWorkingDay, isWorkingHour);

/**
 * @param {number} timestamp a date timestamp
 * @return {boolean} true if the specified date is NOT on a working day in a working hour otherwise false
 */
const isNotValidSubmitDate = R.complement(isValidSubmitDate);

module.exports = {
  calculateDueDate,
  getUtcDay,
  getUtcTime,
  hoursToMsecs,
  isNotValidSubmitDate,
  isValidSubmitDate,
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
  if (isNotValidSubmitDate(submitTimestamp)) {
    throw new Error('Invalid submitTimestamp parameter. Submit date should be a working day (Mon to Fri, 9:00 to 17:00)')
  }

  // TODO extract + test
  const daysToMsecs = R.compose(hoursToMsecs, R.multiply(24));

  const submitDate = new Date(submitTimestamp);
  const smTime = getUtcTime(submitDate);
  const ttWorkDays = Math.floor(turnaroundTime / WORK_HOURS_PER_DAY);
  const ttTime = hoursToMsecs(turnaroundTime % WORK_HOURS_PER_DAY);
  let deltaDays = ttWorkDays;
  let deltaTime = ttTime;

  // try to cut one day from the days part of turnaround time
  // a day can be cut only when the submit time is the start work hour and the time
  // part of the turnaround time is 0
  // for example:
  //   Mon, 26 Sep 9:00 + 8h turn around time will result Mon 26, Sep 17:00 instead of Tue, 27 Sep 9:00
  if (ttTime === 0 && ttWorkDays > 0 && smTime === WORK_HOUR_START_MSECS) {
    deltaTime = hoursToMsecs(WORK_HOURS_PER_DAY);
    deltaDays -= 1;
  }

  // update delta days/time when due time overflows to next working day
  if (smTime + deltaTime > WORK_HOUR_END_MSECS) {
    deltaDays += 1;
    const overflowTime = deltaTime - (WORK_HOUR_END_MSECS - smTime);
    const dueTime = WORK_HOUR_START_MSECS + overflowTime;
    deltaTime = dueTime - smTime;
  }

  // update delta days if due date leaps out of current work week
  const smDayOfWeek = getUtcDay(submitDate);
  const dayOfWeeks = smDayOfWeek + deltaDays;

  if (dayOfWeeks > DAY_OF_WEEK_FRIDAY) {
    const weekCount = Math.floor((dayOfWeeks - DAY_OF_WEEK_SATURDAY) / NUM_WORK_DAYS) + 1;
    deltaDays += weekCount * 2;
  }

  const deltaTimestamp = deltaTime + daysToMsecs(deltaDays);
  const dueDate = new Date(submitTimestamp + deltaTimestamp);

  return dueDate.getTime();
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

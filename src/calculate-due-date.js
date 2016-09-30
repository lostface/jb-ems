'use strict';

const R = require('ramda');
const __ = R.__;
const constants = require('./constants');
const common = require('./common');
const hoursToMsecs = common.hoursToMsecs;
const getUtcDay = common.getUtcDay;
const timestampToDate = common.timestampToDate;
const getUtcTime = common.getUtcTime;
const daysToMsecs = common.daysToMsecs;

const DAY_OF_WEEK_FRIDAY = constants.DAY_OF_WEEK_FRIDAY;
const DAY_OF_WEEK_SATURDAY = constants.DAY_OF_WEEK_SATURDAY;
const DAY_OF_WEEK_SUNDAY = constants.DAY_OF_WEEK_SUNDAY;
const NUM_WORK_DAYS = constants.NUM_WORK_DAYS;
const WORK_HOUR_START = constants.WORK_HOUR_START;
const WORK_HOUR_END = constants.WORK_HOUR_END;
const WORK_HOURS_PER_DAY = constants.WORK_HOURS_PER_DAY;
const WORK_HOUR_START_MSECS = hoursToMsecs(WORK_HOUR_START);
const WORK_HOUR_END_MSECS = hoursToMsecs(WORK_HOUR_END);

/**
 * @param {number} timestamp a date timestamp
 * @return {boolean} true if the specified date timestamp is a working day, otherwise false
 */
const isWorkingDay = R.compose(
  R.both(
    R.gt(__, DAY_OF_WEEK_SUNDAY),
    R.lt(__, DAY_OF_WEEK_SATURDAY)
  ),
  getUtcDay,
  timestampToDate
);

/**
 * @param {number} timestamp a date timestamp
 */
const isWorkingHour = R.compose(
  R.both(
    R.gte(__, WORK_HOUR_START_MSECS),
    R.lte(__, WORK_HOUR_END_MSECS)
  ),
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
  default: calculateDueDate,
  isNotValidSubmitDate,
  isValidSubmitDate,
  isWorkingDay,
  isWorkingHour,
};

/**
 * @param {number} submitTimestamp the submit date in timestamp
 * @param {number} turnaroundTime the turnaround time in working hours
 * @throws {Error}
 * @return {number} the due date timestamp calculated from the specified parameters
 */
function calculateDueDate(submitTimestamp, turnaroundTime) {
  if (isNotValidSubmitDate(submitTimestamp)) {
    throw new Error('Invalid submitTimestamp parameter. Submit date should be a working day (Mon to Fri, 9:00 to 17:00)');
  }

  const calculate = R.compose(
    R.when(isDueDayLeapsOutOfCurrentWeek, addWeekendDays),
    R.when(isDueTimeOverflowsToNextWorkingDay, handleDueTimeOverflow),
    R.when(canUsePrevDayEndInsteadNextDayStart, usePrevDayEndInsteadNextDayStart)
  );

  const submitDate = new Date(submitTimestamp);
  const ttWorkDays = Math.floor(turnaroundTime / WORK_HOURS_PER_DAY);
  const ttTime = hoursToMsecs(turnaroundTime % WORK_HOURS_PER_DAY);

  const result = calculate({
    smTime: getUtcTime(submitDate),
    smDayOfWeek: getUtcDay(submitDate),
    ttWorkDays,
    ttTime,
    deltaDays: ttWorkDays,
    deltaTime: ttTime,
  });

  const deltaDays = result.deltaDays;
  const deltaTime = result.deltaTime;
  const deltaTimestamp = deltaTime + daysToMsecs(deltaDays);
  const dueDate = new Date(submitTimestamp + deltaTimestamp);

  return dueDate.getTime();
}

/**
 * The previous day end can be used instead of the next day start only when
 * the submit time is the start work hour and the time part of the turnaround
 * time is 0
 *
 * for example:
 *   Mon, 26 Sep 9:00 + 8h turn around time will result Mon 26, Sep 17:00 instead of Tue, 27 Sep 9:00
 *
 * @param {Object} args
 * @param {number} args.smTime time part in msecs of submit date
 * @param {number} args.smDayOfWeek day of week of submit date
 * @param {number} args.ttWorkDays working days part of turnaround time
 * @param {number} args.ttTime working time part of turnaround time
 * @param {number} args.deltaDays delta days to due date
 * @param {number} args.deltaTime delta time to due date
 * @return {boolean} true if one working day can be moved to delta time otherwise false
 */
function canUsePrevDayEndInsteadNextDayStart(args) {
  const smTime = args.smTime;
  const ttWorkDays = args.ttWorkDays;
  const ttTime = args.ttTime;

  return ttTime === 0 && ttWorkDays > 0 && smTime === WORK_HOUR_START_MSECS;
}

/**
 * Use the previous working day end instead of the next working day start
 *
 * for example:
 *   Mon, 26 Sep 9:00 + 8h turn around time will result Mon 26, Sep 17:00 instead of Tue, 27 Sep 9:00
 *
 * @param {Object} args
 * @param {number} args.smTime time part in msecs of submit date
 * @param {number} args.smDayOfWeek day of week of submit date
 * @param {number} args.ttWorkDays working days part of turnaround time
 * @param {number} args.ttTime working time part of turnaround time
 * @param {number} args.deltaDays delta days to due date
 * @param {number} args.deltaTime delta time to due date
 * @return {Object} updated args object
 */
function usePrevDayEndInsteadNextDayStart(args) {
  const transformation = {
    deltaDays: R.dec,
    deltaTime: () => hoursToMsecs(WORK_HOURS_PER_DAY),
  };

  return R.evolve(transformation, args);
}

/**
 * Checks if due time overflows to next working day
 *
 * for example:
 *   Mon 26, Sep 15:00 + 6h turnaround time overflows by 4h to next working day
 *
 * @param {Object} args
 * @param {number} args.smTime time part in msecs of submit date
 * @param {number} args.smDayOfWeek day of week of submit date
 * @param {number} args.ttWorkDays working days part of turnaround time
 * @param {number} args.ttTime working time part of turnaround time
 * @param {number} args.deltaDays delta days to due date
 * @param {number} args.deltaTime delta time to due date
 * @return {boolean} true if due time overflows to next working day
 */
function isDueTimeOverflowsToNextWorkingDay(args) {
  const smTime = args.smTime;
  const deltaTime = args.deltaTime;
  const dueTime = smTime + deltaTime;

  return dueTime > WORK_HOUR_END_MSECS;
}

/**
 * Handles due time overflow
 *
 * for example:
 *   Mon 26, Sep 15:00 + 6h turnaround time overflows by 4h to next working day
 *
 * @param {Object} args
 * @param {number} args.smTime time part in msecs of submit date
 * @param {number} args.smDayOfWeek day of week of submit date
 * @param {number} args.ttWorkDays working days part of turnaround time
 * @param {number} args.ttTime working time part of turnaround time
 * @param {number} args.deltaDays delta days to due date
 * @param {number} args.deltaTime delta time to due date
 * @return {Object} updated args object
 */
function handleDueTimeOverflow(args) {
  const smTime = args.smTime;

  const transformation = {
    deltaDays: R.inc,
    deltaTime: deltaTime => {
      const overflowTime = deltaTime - (WORK_HOUR_END_MSECS - smTime);
      const dueTime = WORK_HOUR_START_MSECS + overflowTime;
      return dueTime - smTime;
    },
  };

  return R.evolve(transformation, args);
}

/**
 * Checks if due day leaps out of week of the submit date
 *
 * for example:
 *   Fri 30, Sep 16:00 + 4h turnaround time leaps into next week
 *
 * @param {Object} args
 * @param {number} args.smTime time part in msecs of submit date
 * @param {number} args.smDayOfWeek day of week of submit date
 * @param {number} args.ttWorkDays working days part of turnaround time
 * @param {number} args.ttTime working time part of turnaround time
 * @param {number} args.deltaDays delta days to due date
 * @param {number} args.deltaTime delta time to due date
 * @return {boolean} true if due day leaps out of the week of submit date otherwise false
 */
function isDueDayLeapsOutOfCurrentWeek(args) {
  const smDayOfWeek = args.smDayOfWeek;
  const deltaDays = args.deltaDays;
  const dayOfWeeks = smDayOfWeek + deltaDays;

  return dayOfWeeks > DAY_OF_WEEK_FRIDAY;
}

/**
 * Add the necessary number of weekend days to delta days
 *
 * for example:
 *   Fri 30, Sep 16:00 + 4h turnaround time leaps into next week so 2 weekend days correction will be added
 *
 * @param {Object} args
 * @param {number} args.smTime time part in msecs of submit date
 * @param {number} args.smDayOfWeek day of week of submit date
 * @param {number} args.ttWorkDays working days part of turnaround time
 * @param {number} args.ttTime working time part of turnaround time
 * @param {number} args.deltaDays delta days to due date
 * @param {number} args.deltaTime delta time to due date
 * @return {Object} updated args object
 */
function addWeekendDays(args) {
  const smDayOfWeek = args.smDayOfWeek;
  const deltaDays = args.deltaDays;
  const dayOfWeeks = smDayOfWeek + deltaDays;

  const transformation = {
    deltaDays: deltaDays => {
      const weekCount = Math.floor((dayOfWeeks - DAY_OF_WEEK_SATURDAY) / NUM_WORK_DAYS) + 1;
      return deltaDays + weekCount * 2;
    },
  };

  return R.evolve(transformation, args);
}

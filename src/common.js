'use strict';

const R = require('ramda');

/**
 * @param {number} secs seconds
 * @return {number} secs converted to milliseconds
 */
const secsToMsecs = R.multiply(1000);

/**
 * @param {number} mins minutes
 * @return {number} mins converted to milliseconds
 */
const minsToMsecs = R.compose(secsToMsecs, R.multiply(60));

/**
 * @param {number} hours
 * @return {number} hours converted to milliseconds
 */
const hoursToMsecs = R.compose(minsToMsecs, R.multiply(60));

/**
 * @param {number} days
 * @return {number} days converted to milliseconds
 */
const daysToMsecs = R.compose(hoursToMsecs, R.multiply(24));

/**
 * @param {Funciton} f func to apply on a
 * @param {Funciton} g func to apply on b
 * @param {number} a a number
 * @param {number} b a number
 * @return {number} f(a) + g(b)
 */
const addf = R.curry(
  (f, g, a, b) => f(a) + g(b)
);

/**
 * @param {number} secs seconds
 * @param {number} msecs milliseseconds
 * @return {number} msecs incremented with the specified seconds
 */
const addSecsToMsecs = addf(secsToMsecs, R.identity);

/**
 * @param {number} mins minutes
 * @param {number} msecs milliseseconds
 * @return {number} msecs incremented with the specified minutes
 */
const addMinutesToMsecs = addf(minsToMsecs, R.identity);

/**
 * @param {number} hours hours
 * @param {number} msecs milliseseconds
 * @return {number} msecs incremented with the specified hours
 */
const addHoursToMsecs = addf(hoursToMsecs, R.identity);

/**
 * @param {number} days days
 * @param {number} msecs milliseseconds
 * @return {number} msecs incremented with the specified days
 */
const addDaysToMsecs = addf(daysToMsecs, R.identity);

module.exports = {
  addSecsToMsecs,
  addMinutesToMsecs,
  addHoursToMsecs,
  addDaysToMsecs,
  daysToMsecs,
  getUtcDay,
  getUtcTime,
  hoursToMsecs,
  minsToMsecs,
  secsToMsecs,
  timestampToDate,
};

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

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
 * @param {number} secs seconds
 * @param {number} msecs milliseseconds
 * @return {number} msecs incremented with the specified seconds
 */
const addSecsToMsecs = R.useWith(R.add, [secsToMsecs]);

/**
 * @param {number} mins minutes
 * @param {number} msecs milliseseconds
 * @return {number} msecs incremented with the specified minutes
 */
const addMinsToMsecs = R.useWith(R.add, [minsToMsecs]);

/**
 * @param {number} hours hours
 * @param {number} msecs milliseseconds
 * @return {number} msecs incremented with the specified hours
 */
const addHoursToMsecs = R.useWith(R.add, [hoursToMsecs]);

/**
 * @param {number} days days
 * @param {number} msecs milliseseconds
 * @return {number} msecs incremented with the specified days
 */
const addDaysToMsecs = R.useWith(R.add, [daysToMsecs]);

module.exports = {
  addSecsToMsecs,
  addMinsToMsecs,
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

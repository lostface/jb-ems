'use strict';

const R = require('ramda');
const common = require('./common');
const test = require('tape');
const timestampToDate = common.timestampToDate;
const getUtcDay = common.getUtcDay;
const getUtcTime = common.getUtcTime;
const secsToMsecs = common.secsToMsecs;
const minsToMsecs = common.minsToMsecs;
const hoursToMsecs = common.hoursToMsecs;
const daysToMsecs = common.daysToMsecs;
const addSecsToMsecs = common.addSecsToMsecs;
const addMinutesToMsecs = common.addMinutesToMsecs;
const addHoursToMsecs = common.addHoursToMsecs;
const addDaysToMsecs = common.addDaysToMsecs;

test('timestampToDate output', function(t) {
  const timestamp = getGmtTime('Mon, 26 Sep 2016 12:34:56');
  const expected = 'Mon, 26 Sep 2016 12:34:56 GMT';
  const actual = timestampToDate(timestamp).toGMTString();

  t.equal(actual, expected, `timestampToDate should return (${expected})`);
  t.end();
});

test('getUtcDay output', function(t) {
  const paramsArr = getParams();
  R.forEach(runTests, paramsArr);
  t.end();

  function runTests(param) {
    const date = param.date;
    const dateStr = new Date(date).toGMTString();
    const expected = param.expected;

    t.test(`getUtcDay output when called with (${dateStr})`, function(pt) {
      const actual = getUtcDay(date);
      pt.equal(actual, expected, `getUtcDay should return (${expected})`);
      pt.end();
    });
  }

  function getParams() {
    return [
      {
        date: new Date('Mon, 26 Sep 2016 GMT'),
        expected: 1,
      },
      {
        date: new Date('Tue, 27 Sep 2016 GMT'),
        expected: 2,
      },
      {
        date: new Date('Wed, 28 Sep 2016 GMT'),
        expected: 3,
      },
      {
        date: new Date('Thu, 29 Sep 2016 GMT'),
        expected: 4,
      },
      {
        date: new Date('Fri, 30 Sep 2016 GMT'),
        expected: 5,
      },
      {
        date: new Date('Sat, 1 Oct 2016 GMT'),
        expected: 6,
      },
      {
        date: new Date('Sun, 2 Oct 2016 GMT'),
        expected: 0,
      },
    ];
  }
});

test('getUtcTime output', function(t) {
  const date = new Date('Mon, 26 Sep 2016 12:34:56:789 GMT');
  const expected = 789 + (56 * 1000) + (34 * 60 * 1000) + (12 * 60 * 60 * 1000); // 45296789
  const actual = getUtcTime(date);

  t.equal(actual, expected, `getUtcTime should return (${expected})`);
  t.end();
});

test('secsToMsecs output', function(t) {
  const secs = 56;
  const expected = 56 * 1000; // 56000
  const actual = secsToMsecs(secs);

  t.equal(actual, expected, `secsToMsecs should return (${expected})`);
  t.end();
});

test('minsToMsecs output', function(t) {
  const mins = 33;
  const expected = 33 * 60 * 1000; // 1980000
  const actual = minsToMsecs(mins);

  t.equal(actual, expected, `minsToMsecs should return (${expected})`);
  t.end();
});

test('hoursToMsecs output', function(t) {
  const hours = 7;
  const expected = 7 * 60 * 60 * 1000; // 25200000
  const actual = hoursToMsecs(hours);

  t.equal(actual, expected, `hoursToMsecs should return (${expected})`);
  t.end();
});

test('daysToMsecs output', function(t) {
  const days = 7;
  const expected = 7 * 24 * 60 * 60 * 1000; // 604800000
  const actual = daysToMsecs(days);

  t.equal(actual, expected, `daysToMsecs should return (${expected})`);
  t.end();
});

test('addSecsToMsecs output', function(t) {
  const secs = 56;
  const timestamp = 0;
  const expected = 56 * 1000; // 56000
  const actual = addSecsToMsecs(secs, timestamp);

  t.equal(actual, expected, `addSecsToMsecs should return (${expected})`);
  t.end();
});

test('addMinutesToMsecs output', function(t) {
  const mins = 33;
  const timestamp = 0;
  const expected = 33 * 60 * 1000; // 1980000
  const actual = addMinutesToMsecs(mins, timestamp);

  t.equal(actual, expected, `addMinutesToMsecs should return (${expected})`);
  t.end();
});

test('addHoursToMsecs output', function(t) {
  const hours = 7;
  const timestamp = 0;
  const expected = 7 * 60 * 60 * 1000; // 25200000
  const actual = addHoursToMsecs(hours, timestamp);

  t.equal(actual, expected, `addHoursToMsecs should return (${expected})`);
  t.end();
});

test('addDaysToMsecs output', function(t) {
  const days = 7;
  const timestamp = 0;
  const expected = 7 * 24 * 60 * 60 * 1000; // 604800000
  const actual = addDaysToMsecs(days, timestamp);

  t.equal(actual, expected, `addDaysToMsecs should return (${expected})`);
  t.end();
});

function getGmtTime(dateStr) {
  return new Date(`${dateStr} GMT`).getTime();
}

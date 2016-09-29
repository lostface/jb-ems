'use strict';

const R = require('ramda');
const index = require('./index');
const calculateDueDate = index.calculateDueDate;
const isWorkingDay = index.isWorkingDay;
const timestampToDate = index.timestampToDate;
const getUtcDay = index.getUtcDay;
const isWorkingHour = index.isWorkingHour;
const getUtcTime = index.getUtcTime;
const test = require('tape');

// const WEEK_DAY_STRS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
// const WEEKEND_DAY_STRS = ['Sat', 'Sun'];
const DUMMY_TURNAROUND_TIME = 8;

test('calculateDueDate called with invalid submit dates', function(t) {
  const paramsArr = getParams();
  R.forEach(runTests, paramsArr);
  t.end();

  function runTests(params) {
    const submitTimestamp = params.submitTimestamp;
    const submitDateStr = new Date(submitTimestamp).toGMTString();
    const turnaroundTime = DUMMY_TURNAROUND_TIME;

    t.test(`calculateDueDate called with invalid submit date (${submitDateStr})`, function(pt) {
      pt.throws(
        () => calculateDueDate(submitTimestamp, turnaroundTime),
        /Error: Invalid submitTimestamp parameter\. Submit date should be a working day \(Mon to Fri, 9:00 to 17:00\)/,
        'calculateDueDate() should throw exception when called with invalid submit date'
      );

      pt.end();
    });
  }

  function getParams() {
    return [
      // week days
      {
        submitTimestamp: getGmtTime('Mon, 26 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getGmtTime('Mon, 26 Sep 2016 17:01'),
      },
      {
        submitTimestamp: getGmtTime('Tue, 27 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getGmtTime('Tue, 27 Sep 2016 17:01'),
      },
      {
        submitTimestamp: getGmtTime('Wed, 28 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getGmtTime('Wed, 28 Sep 2016 17:01'),
      },
      {
        submitTimestamp: getGmtTime('Thu, 29 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getGmtTime('Thu, 29 Sep 2016 17:01'),
      },
      {
        submitTimestamp: getGmtTime('Fri, 30 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getGmtTime('Fri, 30 Sep 2016 17:01'),
      },

      // weeken days
      {
        submitTimestamp: getGmtTime('Sat, 1 Oct 2016 8:59'),
      },
      {
        submitTimestamp: getGmtTime('Sat, 1 Oct 2016 12:00'),
      },
      {
        submitTimestamp: getGmtTime('Sat, 1 Oct 2016 17:01'),
      },
      {
        submitTimestamp: getGmtTime('Sun, 2 Oct 2016 8:59'),
      },
      {
        submitTimestamp: getGmtTime('Sun, 2 Oct 2016 12:00'),
      },
      {
        submitTimestamp: getGmtTime('Sun, 2 Oct 2016 17:01'),
      },
    ];
  }
});

test('isWorkingDay output', function(t) {
  const paramsArr = getParams();
  R.forEach(runTests, paramsArr);
  t.end();

  function runTests(param) {
    const timestamp = param.timestamp;
    const dateStr = new Date(timestamp).toGMTString();
    const expected = param.expected;

    t.test(`isWorkingDay output when called with (${dateStr})`, function(pt) {
      const actual = isWorkingDay(timestamp);
      pt.equal(actual, expected, `isWorkingDay should return (${expected})`);
      pt.end();
    });
  }

  function getParams() {
    return [
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Tue, 27 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Wed, 28 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Thu, 29 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Fri, 30 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Sat, 1 Oct 2016'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Sun, 2 Oct 2016'),
        expected: false,
      },
    ];
  }
});

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

test('isWorkingHour output', function(t) {
  const paramsArr = getParams();
  R.forEach(runTests, paramsArr);
  t.end();

  function runTests(param) {
    const timestamp = param.timestamp;
    const dateStr = new Date(timestamp).toGMTString();
    const expected = param.expected;

    t.test(`isWorkingHour output when called with (${dateStr})`, function(pt) {
      const actual = isWorkingHour(timestamp);
      pt.equal(actual, expected, `isWorkingHour should return (${expected})`);
      pt.end();
    });
  }

  function getParams() {
    return [
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 9:00:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 12:00:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 17:00:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 8:59:59'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 17:00:01'),
        expected: false,
      },
    ];
  }
});

test.only('getUtcTime output', function(t) {
  const date = new Date('Mon, 26 Sep 2016 12:34:56:789 GMT');
  const expected = 789 + (56 * 1000) + (34 * 60 * 1000) + (12 * 60 * 60 * 1000); // 45296789
  const actual = getUtcTime(date);

  t.equal(actual, expected, `getUtcTime should return (${expected})`);
  t.end();
});

function getGmtTime(dateStr) {
  return new Date(`${dateStr} GMT`).getTime();
}

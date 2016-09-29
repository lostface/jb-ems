'use strict';

const R = require('ramda');
const index = require('./index');
const calculateDueDate = index.calculateDueDate;
const isWorkingDay = index.isWorkingDay;
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
    const submitDateStr = new Date(submitTimestamp).toString();
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
        submitTimestamp: getTime('Mon, 26 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getTime('Mon, 26 Sep 2016 17:01'),
      },
      {
        submitTimestamp: getTime('Tue, 27 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getTime('Tue, 27 Sep 2016 17:01'),
      },
      {
        submitTimestamp: getTime('Wed, 28 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getTime('Wed, 28 Sep 2016 17:01'),
      },
      {
        submitTimestamp: getTime('Thu, 29 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getTime('Thu, 29 Sep 2016 17:01'),
      },
      {
        submitTimestamp: getTime('Fri, 30 Sep 2016 8:59'),
      },
      {
        submitTimestamp: getTime('Fri, 30 Sep 2016 17:01'),
      },

      // weeken days
      {
        submitTimestamp: getTime('Sat, 1 Oct 2016 8:59'),
      },
      {
        submitTimestamp: getTime('Sat, 1 Oct 2016 12:00'),
      },
      {
        submitTimestamp: getTime('Sat, 1 Oct 2016 17:01'),
      },
      {
        submitTimestamp: getTime('Sun, 2 Oct 2016 8:59'),
      },
      {
        submitTimestamp: getTime('Sun, 2 Oct 2016 12:00'),
      },
      {
        submitTimestamp: getTime('Sun, 2 Oct 2016 17:01'),
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
    const dateStr = new Date(timestamp).toString();
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
        timestamp: getTime('Mon, 26 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getTime('Tue, 27 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getTime('Wed, 28 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getTime('Thu, 29 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getTime('Fri, 30 Sep 2016'),
        expected: true,
      },
      {
        timestamp: getTime('Sat, 1 Oct 2016'),
        expected: false,
      },
      {
        timestamp: getTime('Sun, 2 Oct 2016'),
        expected: false,
      },
    ];
  }
});

function getTime(dateStr) {
  return new Date(dateStr).getTime();
}

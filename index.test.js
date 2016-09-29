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
    const submitDate = params.submitDate;
    const submitDateStr = new Date(submitDate).toString();
    const turnaroundTime = DUMMY_TURNAROUND_TIME;

    t.test(`calculateDueDate called with invalid submit date (${submitDateStr})`, function(pt) {
      pt.throws(
        () => calculateDueDate(submitDate, turnaroundTime),
        /Error: Invalid submitDate parameter\. Submit date should be a working day \(Mon to Fri, 9:00 to 17:00\)/,
        'calculateDueDate() should throw exception when called with invalid submit date'
      );

      pt.end();
    });
  }

  function getParams() {
    return [
      // week days
      {
        submitDate: getTime('Mon, 26 Sep 2016 8:59'),
      },
      {
        submitDate: getTime('Mon, 26 Sep 2016 17:01'),
      },
      {
        submitDate: getTime('Tue, 27 Sep 2016 8:59'),
      },
      {
        submitDate: getTime('Tue, 27 Sep 2016 17:01'),
      },
      {
        submitDate: getTime('Wed, 28 Sep 2016 8:59'),
      },
      {
        submitDate: getTime('Wed, 28 Sep 2016 17:01'),
      },
      {
        submitDate: getTime('Thu, 29 Sep 2016 8:59'),
      },
      {
        submitDate: getTime('Thu, 29 Sep 2016 17:01'),
      },
      {
        submitDate: getTime('Fri, 30 Sep 2016 8:59'),
      },
      {
        submitDate: getTime('Fri, 30 Sep 2016 17:01'),
      },

      // weeken days
      {
        submitDate: getTime('Sat, 1 Oct 2016 8:59'),
      },
      {
        submitDate: getTime('Sat, 1 Oct 2016 12:00'),
      },
      {
        submitDate: getTime('Sat, 1 Oct 2016 17:01'),
      },
      {
        submitDate: getTime('Sun, 2 Oct 2016 8:59'),
      },
      {
        submitDate: getTime('Sun, 2 Oct 2016 12:00'),
      },
      {
        submitDate: getTime('Sun, 2 Oct 2016 17:01'),
      },
    ];
  }
});

test('isWorkingDay output', function(t) {
  const paramsArr = getParams();
  R.forEach(runTests, paramsArr);
  t.end();

  function runTests(param) {
    const date = param.date;
    const dateStr = new Date(date).toString();
    const expected = param.expected;

    t.test(`isWorkingDay output when called with (${dateStr})`, function(pt) {
      const actual = isWorkingDay(date);
      pt.equal(actual, expected, 'isWorkingDay should return the correct output');
      pt.end();
    });
  }

  function getParams() {
    return [
      {
        date: getTime('Mon, 26 Sep 2016'),
        expected: true,
      },
      {
        date: getTime('Tue, 27 Sep 2016'),
        expected: true,
      },
      {
        date: getTime('Wed, 28 Sep 2016'),
        expected: true,
      },
      {
        date: getTime('Thu, 29 Sep 2016'),
        expected: true,
      },
      {
        date: getTime('Fri, 30 Sep 2016'),
        expected: true,
      },
      {
        date: getTime('Sat, 1 Oct 2016'),
        expected: false,
      },
      {
        date: getTime('Sun, 2 Oct 2016'),
        expected: false,
      },
    ];
  }
});

function getTime(dateStr) {
  return new Date(dateStr).getTime();
}

'use strict';

const test = require('tape');
const R = require('ramda');
const mod = require('./calculate-due-date');
const calculateDueDate = mod.calculateDueDate;
const isWorkingDay = mod.isWorkingDay;
const isWorkingHour = mod.isWorkingHour;
const isValidSubmitDate = mod.isValidSubmitDate;

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

test('calculateDueDate output', function(t) {
  const paramsArr = getParams();
  R.forEach(runTests, paramsArr);
  t.end();

  function runTests(param) {
    const id = param.id;
    const submitTimestamp = param.timestamp;
    const dateStr = new Date(submitTimestamp).toGMTString();
    const turnaroundTime = param.turnaroundTime;
    const expected = param.expected;

    t.test(`calculateDueDate output when called with (${dateStr}, ${turnaroundTime}) (case: ${id})`, function(pt) {
      const result = calculateDueDate(submitTimestamp, turnaroundTime);
      const actual = new Date(result).toGMTString();
      pt.equal(actual, expected, `calculateDueDate should return (${expected})`);
      pt.end();
    });
  }

  function getParams() {
    return [
      // Monday: same day, next day, next week
      {
        id: 1,
        timestamp: getGmtTime('Mon, 26 Sep 2016 09:00'),
        turnaroundTime: 4,
        expected: 'Mon, 26 Sep 2016 13:00:00 GMT',
      },
      {
        id: 2,
        timestamp: getGmtTime('Mon, 26 Sep 2016 12:00'),
        turnaroundTime: 12,
        expected: 'Tue, 27 Sep 2016 16:00:00 GMT',
      },
      {
        id: 3,
        timestamp: getGmtTime('Mon, 26 Sep 2016 17:00'),
        turnaroundTime: 40,
        expected: 'Mon, 03 Oct 2016 17:00:00 GMT',
      },

      // Tuesday: same day, next day, next week
      {
        id: 4,
        timestamp: getGmtTime('Tue, 27 Sep 2016 09:00'),
        turnaroundTime: 8,
        expected: 'Tue, 27 Sep 2016 17:00:00 GMT',
        // expected: 'Wed, 28 Sep 2016 09:00:00 GMT',
      },
      {
        id: 5,
        timestamp: getGmtTime('Tue, 27 Sep 2016 12:00'),
        turnaroundTime: 8,
        expected: 'Wed, 28 Sep 2016 12:00:00 GMT',
      },
      {
        id: 6,
        timestamp: getGmtTime('Tue, 27 Sep 2016 17:00'),
        turnaroundTime: 33,
        expected: 'Tue, 04 Oct 2016 10:00:00 GMT',
      },

      // Wednesday: same day, next day, next week
      {
        id: 7,
        timestamp: getGmtTime('Wed, 28 Sep 2016 09:00'),
        turnaroundTime: 2,
        expected: 'Wed, 28 Sep 2016 11:00:00 GMT',
      },
      {
        id: 8,
        timestamp: getGmtTime('Wed, 28 Sep 2016 12:00'),
        turnaroundTime: 13,
        expected: 'Thu, 29 Sep 2016 17:00:00 GMT',
      },
      {
        id: 9,
        timestamp: getGmtTime('Wed, 28 Sep 2016 17:00'),
        turnaroundTime: 2,
        expected: 'Thu, 29 Sep 2016 11:00:00 GMT',
      },

      // Thursday: same day, next day, next week
      {
        id: 10,
        timestamp: getGmtTime('Thu, 29 Sep 2016 09:00'),
        turnaroundTime: 6,
        expected: 'Thu, 29 Sep 2016 15:00:00 GMT',
      },
      {
        id: 11,
        timestamp: getGmtTime('Thu, 29 Sep 2016 12:00'),
        turnaroundTime: 5,
        expected: 'Thu, 29 Sep 2016 17:00:00 GMT',
      },
      {
        id: 12,
        timestamp: getGmtTime('Thu, 29 Sep 2016 17:00'),
        turnaroundTime: 16,
        expected: 'Mon, 03 Oct 2016 17:00:00 GMT',
      },

      // Friday: same day, next day, next week
      {
        id: 13,
        timestamp: getGmtTime('Fri, 30 Sep 2016 09:00'),
        turnaroundTime: 3,
        expected: 'Fri, 30 Sep 2016 12:00:00 GMT',
      },
      {
        id: 14,
        timestamp: getGmtTime('Fri, 30 Sep 2016 12:00'),
        turnaroundTime: 9,
        expected: 'Mon, 03 Oct 2016 13:00:00 GMT',
      },
      {
        id: 15,
        timestamp: getGmtTime('Fri, 30 Sep 2016 17:00'),
        turnaroundTime: 8,
        expected: 'Mon, 03 Oct 2016 17:00:00 GMT',
      },

      // Due date in 2 weeks
      {
        id: 16,
        timestamp: getGmtTime('Wed, 28 Sep 2016 09:00'),
        turnaroundTime: 87,
        expected: 'Wed, 12 Oct 2016 16:00:00 GMT',
      },
      // Due date in 4 weeks
      {
        id: 17,
        timestamp: getGmtTime('Wed, 28 Sep 2016 09:00'),
        turnaroundTime: 163,
        expected: 'Wed, 26 Oct 2016 12:00:00 GMT',
      },

      // Due date is same day end instead of next day start cases
      {
        id: 18,
        timestamp: getGmtTime('Mon, 26 Sep 2016 09:00'),
        turnaroundTime: 8,
        expected: 'Mon, 26 Sep 2016 17:00:00 GMT',
      },
      {
        id: 19,
        timestamp: getGmtTime('Mon, 26 Sep 2016 09:00'),
        turnaroundTime: 16,
        expected: 'Tue, 27 Sep 2016 17:00:00 GMT',
      },
      {
        id: 20,
        timestamp: getGmtTime('Mon, 26 Sep 2016 09:00'),
        turnaroundTime: 24,
        expected: 'Wed, 28 Sep 2016 17:00:00 GMT',
      },
      {
        id: 21,
        timestamp: getGmtTime('Mon, 26 Sep 2016 09:00'),
        turnaroundTime: 9,
        expected: 'Tue, 27 Sep 2016 10:00:00 GMT',
      },
      {
        id: 22,
        timestamp: getGmtTime('Mon, 26 Sep 2016 09:00'),
        turnaroundTime: 17,
        expected: 'Wed, 28 Sep 2016 10:00:00 GMT',
      },
      {
        id: 23,
        timestamp: getGmtTime('Mon, 26 Sep 2016 09:00'),
        turnaroundTime: 25,
        expected: 'Thu, 29 Sep 2016 10:00:00 GMT',
      },
      {
        id: 24,
        timestamp: getGmtTime('Mon, 26 Sep 2016 12:00'),
        turnaroundTime: 5,
        expected: 'Mon, 26 Sep 2016 17:00:00 GMT',
      },
      {
        id: 25,
        timestamp: getGmtTime('Mon, 26 Sep 2016 12:00'),
        turnaroundTime: 13,
        expected: 'Tue, 27 Sep 2016 17:00:00 GMT',
      },
      {
        id: 26,
        timestamp: getGmtTime('Mon, 26 Sep 2016 12:00'),
        turnaroundTime: 21,
        expected: 'Wed, 28 Sep 2016 17:00:00 GMT',
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

test('isValidSubmitDate output', function(t) {
  const paramsArr = getParams();
  R.forEach(runTests, paramsArr);
  t.end();

  function runTests(param) {
    const timestamp = param.timestamp;
    const dateStr = new Date(timestamp).toGMTString();
    const expected = param.expected;

    t.test(`isValidSubmitDate output when called with (${dateStr})`, function(pt) {
      const actual = isValidSubmitDate(timestamp);
      pt.equal(actual, expected, `isValidSubmitDate should return (${expected})`);
      pt.end();
    });
  }

  function getParams() {
    return [
      // week days
      // Monday
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 9:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 12:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 17:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 8:59'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Mon, 26 Sep 2016 17:01'),
        expected: false,
      },

      // Tuesday
      {
        timestamp: getGmtTime('Tue, 27 Sep 2016 9:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Tue, 27 Sep 2016 12:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Tue, 27 Sep 2016 17:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Tue, 27 Sep 2016 8:59'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Tue, 27 Sep 2016 17:01'),
        expected: false,
      },

      // Wednesday
      {
        timestamp: getGmtTime('Wed, 28 Sep 2016 9:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Wed, 28 Sep 2016 12:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Wed, 28 Sep 2016 17:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Wed, 28 Sep 2016 8:59'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Wed, 28 Sep 2016 17:01'),
        expected: false,
      },

      // Thursday
      {
        timestamp: getGmtTime('Thu, 29 Sep 2016 9:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Thu, 29 Sep 2016 12:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Thu, 29 Sep 2016 17:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Thu, 29 Sep 2016 8:59'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Thu, 29 Sep 2016 17:01'),
        expected: false,
      },

      // Friday
      {
        timestamp: getGmtTime('Fri, 30 Sep 2016 9:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Fri, 30 Sep 2016 12:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Fri, 30 Sep 2016 17:00'),
        expected: true,
      },
      {
        timestamp: getGmtTime('Fri, 30 Sep 2016 8:59'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Fri, 30 Sep 2016 17:01'),
        expected: false,
      },

      // weeken days
      // Saturday
      {
        timestamp: getGmtTime('Sat, 1 Oct 2016 8:59'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Sat, 1 Oct 2016 12:00'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Sat, 1 Oct 2016 17:01'),
        expected: false,
      },

      // Sunday
      {
        timestamp: getGmtTime('Sun, 2 Oct 2016 8:59'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Sun, 2 Oct 2016 12:00'),
        expected: false,
      },
      {
        timestamp: getGmtTime('Sun, 2 Oct 2016 17:01'),
        expected: false,
      },
    ];
  }
});

function getGmtTime(dateStr) {
  return new Date(`${dateStr} GMT`).getTime();
}

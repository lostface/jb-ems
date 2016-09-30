'use strict';

const R = require('ramda');
const index = require('./index');
const calculateDueDate = index.calculateDueDate;
const isWorkingDay = index.isWorkingDay;
const timestampToDate = index.timestampToDate;
const getUtcDay = index.getUtcDay;
const isWorkingHour = index.isWorkingHour;
const getUtcTime = index.getUtcTime;
const secsToMsecs = index.secsToMsecs;
const minsToMsecs = index.minsToMsecs;
const hoursToMsecs = index.hoursToMsecs;
const isValidSubmitDate = index.isValidSubmitDate;
const daysToMsecs = index.daysToMsecs;
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

test('daysToMsecs output', function(t) {
  const days = 7;
  const expected = 7 * 24 * 60 * 60 * 1000; // 604800000
  const actual = daysToMsecs(days);

  t.equal(actual, expected, `daysToMsecs should return (${expected})`);
  t.end();
});

function getGmtTime(dateStr) {
  return new Date(`${dateStr} GMT`).getTime();
}

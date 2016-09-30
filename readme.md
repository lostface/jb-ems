### Run the tests
Issue the following once

```
npm install
```
Next rn the tests via
```
npm test
```

### Notes
- the implementation is idealized it assumes valid input from the cosnumers, it only cares about business logic (e.g.: the submit date is a working hour of a working day)
- when called with invalid submit date an exception is thrown. this is better then returning a null or undefined because it will fail fast at the source of problem which won't require deeper debugging and mystic cases.
- however throwing an exception is still a side effect from the perspective of FP, the more interesting and safely usable solution would be the use of Either type which can be mapped over etc and won't need defensive programming, try-catch, if-else control flows.
- for the input and output type the number (date timestamp) type is choosen because it is guaranteed that is a UTC/GMT timestamp, plus easier to calc with. ISO date strings could be also choosen, but it would needed transformation before calcs.
- property based testing, random input generation would help a lot in testing instead of creating big (but useful) parameterized tests

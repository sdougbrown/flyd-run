import o from 'ospec';
import { isDefined } from '../src/is';

o.spec('isDefined', () => {
  o('will return true with any value', () => {
    o(isDefined(true)).equals(true);
    o(isDefined(false)).equals(true);
    o(isDefined(1)).equals(true);
    o(isDefined(0)).equals(true);
    o(isDefined(null)).equals(true);
    o(isDefined('hi')).equals(true);
  });

  o('will return false when undefined', () => {
    let test;

    o(isDefined(test)).equals(false);
    o(isDefined(undefined)).equals(false);
    o(isDefined(void 0)).equals(false);
  });
});

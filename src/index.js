import { stream, combine } from 'flyd';
import { isDefined } from './is';

/**
 * runner Stream
 *
 * A thin wrapper around a flyd stream that
 * adds a 'run' method that only evaluates when the
 * stream is not in a pending (undefined) state,
 * as well as a child `error` stream, and a `catch`
 * method that will fire when the parent stream is in an
 * errored state.
 *
 * @param {Any} value
 * @returns {flyd.stream}
 */
export default function streamer(value) {
  const s = stream(value);

  return bindStream(s);
}

/**
 * rejecter Stream
 *
 * Returns a stream in an errored and ended state.
 */
export function rejecter() {
  const s = streamer();

  s.error(true);
  s.end(true);

  return s;
}

streamer.reject = rejecter;

/**
 * runner Stream
 *
 * Binds a method that is similar to `flyd.map`,
 * except that the callback is not evaluated if
 * the stream is pending.
 *
 * The callback will also execute immediately when
 * bound if the stream already contains a value.
 *
 * @param {Function} cb
 * @param {flyd.stream} runStream
 * @returns {flyd.stream}
 */
export function runner(cb, runStream) {
  const running = combine((st, self) => {
    self(run(cb, st));
  }, [runStream]);

  return bindStream(running);
}

/**
 * errRunner Stream
 *
 * Runs only when the main stream is inactive or
 * if the error stream has a value
 *
 * @param {Function} cb
 * @param {flyd.stream} main
 * @param {flyd.stream} err
 * @returns {flyd.stream}
 */
export function errRunner(cb, main, err) {
  return combine((mainstream, errstream, self) => {
    if (isDefined(mainstream.val)) {
      return self(void 0); // eslint-disable-line no-void
    }
    return self(run(cb, errstream));
  }, [main, err]);
}

/**
 * catcher Stream
 *
 * Binds a method that only runs if the stream is
 * in an 'error' state - otherwise returns the main
 * stream value.
 *
 * @param {Function} cb
 * @param {flyd.stream} main
 * @param {flyd.stream} err
 * @returns {flyd.stream}
 */
export function catcher(cb, main, err) {
  return combine((mainstream, errstream, self) => {
    if (isDefined(mainstream.val)) {
      return self(mainstream.val);
    }
    if (isDefined(errstream.val)) {
      return self(cb(errstream.val));
    }
    /* eslint-disable no-void */
    return self(void 0);
    /* eslint-enable no-void */
  }, [main, err]);
}

/**
 * run
 *
 * executes `cb` if the stream is not pending
 *
 * @param {Function} cb
 * @param {flyd.stream} st
 */
function run(cb, st) {
  /* eslint-disable no-void */
  return (isDefined(st.val)) ? cb(st.val) : void 0;
  /* eslint-enable no-void */
}


/**
 * bindStream
 *
 * Accepts a stream and sprinkles some magic onto it.
 *
 * @param {flyd.stream} s
 * @returns {flyd.stream}
 */
function bindStream(s) {
  s.run = (onRun) => runner(onRun, s);

  s.error = stream();
  s.error.run = (onErr) => errRunner(onErr, s, s.error);

  s.catch = (onCatch) => catcher(onCatch, s, s.error);

  return s;
}


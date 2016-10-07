import o from 'ospec';
import stream from '../src/index';
import { isDefined } from '../src/is';
import { isStream } from 'flyd';

o.spec('Run Stream Basics', () => {
  o('has all the right stuff', () => {
    const st = stream();

    o(isStream(st)).equals(true);
    o(isStream(st.error)).equals(true);

    o(st.run instanceof Function).equals(true);
    o(st.error.run instanceof Function).equals(true);
    o(st.catch instanceof Function).equals(true);
  });

  o.spec('Run Method Behaviour', () => {
    o('run returns a dependant stream', () => {
      const st = stream();
      const spy = o.spy();
      const run = st.run(spy);

      o(isStream(run)).equals(true);

      o(run.run instanceof Function).equals(true);
    });

    o('does not run when stream is "pending"', () => {
      const st = stream();
      const spy = o.spy();

      st.run(spy);

      o(spy.callCount).equals(0);

      st(null);

      o(spy.callCount).equals(1);
    });

    o('runs immediately when stream has a value', () => {
      const st = stream(null);
      const spy = o.spy();

      st.run(spy);

      o(spy.callCount).equals(1);
    });

    o('runs every time the value changes', () => {
      const st = stream(0);
      const spy = o.spy();

      st.run(spy);

      o(spy.callCount).equals(1);

      st(1);

      o(spy.callCount).equals(2);

      st(2);

      o(spy.callCount).equals(3);
    });
  });

  o.spec('Rejection', () => {
    o('has a reject property on the constructor', () => {
      o(isDefined(stream.reject)).equals(true);
    });

    o('reject returns an errored and ended stream', () => {
      const st = stream.reject();

      o(st.end()).equals(true);
      o(st.error()).equals(true);
    });
  });

  o.spec('Errors', () => {
    o('should not run if main and error streams are pending', () => {
      const st = stream();
      const spy = o.spy();

      st.error.run(spy);

      o(spy.callCount).equals(0);
    });

    o('should run if the error stream receives a value', () => {
      const st = stream();
      const spy = o.spy();

      st.error('bad');
      st.error.run(spy);

      o(spy.callCount).equals(1);
    });

    o('should not run if the main stream has a value', () => {
      const st = stream();
      const spy = o.spy();

      st('good');
      st.error('bad');
      st.error.run(spy);

      // this one is up for debate - not really sure on this
      o(spy.callCount).equals(0);
    });
  });

  o.spec('Catch', () => {
    o('returns a stream', () => {
      const st = stream();
      const ct = st.catch(() => 'foo');

      o(isStream(ct)).equals(true);
    });

    o('should remain pending while the parent streams are pending', () => {
      const st = stream();
      const ct = st.catch(() => 'foo');

      o(ct()).equals(void 0);
    });

    o('should return the fallback value if the main stream errors', () => {
      const st = stream();
      const ct = st.catch(() => 'foo');

      st.error(true);

      ct.map((val) => {
        o(val).equals('foo');
      });
    });

    o('should return main stream value if available', () => {
      const st = stream();
      const ct = st.catch(() => 'foo');

      st(true);

      ct.map((val) => {
        o(val).equals(true);
      });
    });
  });
});

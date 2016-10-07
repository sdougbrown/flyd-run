import o from 'ospec';
import stream from '../src/index';
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
});

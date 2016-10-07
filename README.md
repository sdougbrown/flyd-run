# 🏃 Flyd Run

[![Build Status](https://travis-ci.org/sdougbrown/flyd-run.svg)](https://travis-ci.org/sdougbrown/flyd-run)
[![GitHub issues](https://img.shields.io/github/issues/sdougbrown/flyd-run.svg)](https://github.com/sdougbrown/flyd-run/issues)
[![Dependencies](https://img.shields.io/david/sdougbrown/flyd-run.svg?style=flat)](https://david-dm.org/sdougbrown/flyd-run)

"Smarter" [flyd](https://github.com/paldepind/flyd) streams - run/error/catch functional handlers

### What?

This is just a wrapper around flyd's stream API that adds a couple few new properties: `run`, `error`, and `catch`.  These are largely inspired by [mithril's new m.prop](https://github.com/lhorie/mithril.js/blob/rewrite/docs/prop.md).

The nice part of this particular module is that it's fully compatible with the [flyd](https://github.com/paldepind/flyd) API - opening the door to powerful constructs.

### Why?

Having a common API on every stream in an application allows you to do wrap other functionality and always provide the same API surface.  For example, you could wrap a fetch request like so:

```js
// vastly simplified for clarity
// note that flyd streams absorb promises
function request(url, ops = {}) {
  const req = stream();

  fetch(url, ops).then((response) => {
    if (response.ok) {
      req.error(null);
      return req(response.json());
    }
    return req.error(response.json());
  }).catch((rejection) => {
    return req.error(rejection);
  });

  return req;
}
```

This would allow you to fetch requests and retreive responses via the stream API...

```js
const req = request('/api/user/1');

req.run((response) => {
  store.save('user', response);
});

req.error.run((rejection) => {
  alert(rejection.message);
});
```

#### But how is that any different from using Promises?

This technique allows you to sustitute a fetch request behind the scene for a locally cached response - just wrap the cached data with the same `stream` call and you get the same API - that way your view code et-all doesn't need to worry about caches etc.

A simplified example...

```js
const cacheObj = {};

export function load({ name, locale = 'en' }) {
  const requestUrl = `${API_URL}?document=${name}&locale=${locale}`;
  const storeKey = `${name}_${locale}`;

  return get(requestUrl, storeKey);
}

function cache(name, obj) {
  if (!name) {
    throw new Error('no cache identifier provided');
  }

  if (isDefined(obj)) {
    cacheObj[name] = obj;
  }

  return cacheObj[name];
}

function get(url, key) {
  const stored = cache(key);

  if (stored) {
    return stream(stored);
  }

  const req = request(url);

  req.run((item) => {
    cache(key, item);
  });

  return req.catch(() => {
    return cache(key, null);
  });
}
```

That way in the view/router/wherever you might just run...
```js
import { load } from 'store';

const dataReq = load({ name: 'post123', locale: 'zh'});

dataReq.run((post) => {
  // send to view state
});
```

This abstracts the caching concern away from the view and allows you to quietly refactor and improve without worrying about the view-facing API.

Also, by their very nature, streams may represent data in different states and therefore may run more than once.  (Promises fire only once, by contrast).  This could be very desireable in live-updating applications (e.g. websocket responses).

### Wait, isn't 'Run' just 'Map'?

It's certainly similar, but does two important things:

 - Guarantees to never fire the callback when the stream is pending (`undefined` value).
 - Sounds cooler, and is easier to understand in the context of async requests.


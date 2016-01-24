# http-promises

[![Build Status](https://travis-ci.org/philcockfield/http-promises.svg)](https://travis-ci.org/philcockfield/http-promises)

Consistent HTTP request API on both server and browser using promises.


## API

- `http.get(url)`
- `http.post(url, { payload })`
- `http.put(url, { payload })`
- `http.delete(url)`
- `http.header(key, value)`


## Usage
#### Server

```js
import http from "http-promises/server";

let URL = "http://domain.com/foo";
http.get(URL)
  .then(result => { ... })
  .catch(err => { throw err; });

http.put(URL, { foo: 123 })
  .then(result => { ... })
  .catch(err => { throw err; });

```

#### Headers
Add headers by calling the chainable `header(key, value)` method:
```js

http
  .header("Context-Type", "application/json")
  .header("My-Header", 1234)
  .get("/endpoint")
  .then( ... )

```

Adding headers is immutable. Each call to `header` returns a fresh API.  The root `http` API is not effected.



#### Browser (Client)
Using it within the browser is exactly the same as the server, just require `"http-promises/browser"`

```js
import http from "http-promises/browser";

http.get("/foo")
  .then(result => { ... })
  .catch(err => { throw err; });

```




## Test
    npm test




---
### License: MIT

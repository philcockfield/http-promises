# http-promises

[![Build Status](https://travis-ci.org/philcockfield/http-promises.svg)](https://travis-ci.org/philcockfield/http-promises)

Consistent HTTP request API on both server and browser using promises.


## API

- `http.get(url)`
- `http.post(url, { payload })`
- `http.put(url, { payload })`
- `http.delete(url)`


## Usage
On the server:

```js
import http from "http-promises/server";

let URL = "http://domain.com/foo";
http.get(URL)
  .then((result) => { ... })
  .catch((err) => { throw err; });

http.put(URL, { foo: 123 })
  .then((result) => { ... })
  .catch((err) => { throw err; });

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

Adding headers in this way is immutable with each call to `header` returning a fresh API.  To root `http` API is uneffected.



#### Browser (Client)
Using it within the browser is exactly the same as the server, just require `"http-promises/browser"`

```js
import http from "http-promises/browser";

http.get("/foo")
  .then((result) => { ... })
  .catch((err) => { throw err; });

```




## Test
    npm test




## License (MIT)
Copyright © 2015, **Phil Cockfield**

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

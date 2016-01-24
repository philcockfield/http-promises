# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
#### Added
#### Changed
- Referencing [Babel](https://babeljs.io/) dependencies via `js-babel` and `js-babel-dev` modules.
- Linting updated to use [AirBnB style guide](https://github.com/airbnb/javascript).


#### Deprecated
#### Removed
#### Fixed
#### Security

## [1.1.0] - 2015-11-4
#### Changed
The result from the promise returned from HTTP methods (get/push/post/delete) is no longer the direct data result, but rather an object, allowing headers to be returned:

    {
      data: ... // The response data (formerly this was the 'result' value),
      headers: ... // The response header data.
    }

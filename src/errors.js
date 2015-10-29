import R from "ramda";


/**
 * Describes an error that occured during an XMLHttpRequest operation.
 */
export class HttpError extends Error {
  constructor(status, message, statusText) {
    super();
    if (R.isNil(message)) { message = "Failed while making Http request."; }
    this.status = status || 500;
    this.message = message;
    this.statusText = statusText;
  }
}


/**
 * Describes an error resulting from parsing response
 * data from an HTTP request.
 */
export class HttpParseError extends Error {
  constructor(responseText, parseError) {
    super();
    this.message = `Failed to parse: "${ responseText }"`;
    this.responseText = responseText;
    this.parseError = parseError;
  }
}

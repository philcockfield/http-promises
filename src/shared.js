import R from 'ramda';
import * as util from 'js-util';
import { HttpError, HttpParseError } from './errors';


/**
 * Determines whether the given string is JSON.
 *
 * @param {string} text: The string to example.
 * @return {boolean}
 */
export const isJson = (text) => {
  if (R.isNil(text) || R.isEmpty(text)) { return false; }
  if (text.startsWith('{') && text.endsWith('}')) { return true; }
  if (text.startsWith('[') && text.endsWith(']')) { return true; }
  return false;
};



/**
 * Handles a completed HTTP request.
 *
 * @param {integer} status: The HTTP status code.
 * @param {string} responseText: The raw text returned within the response.
 * @param {string} statusText: The text describing the status
 * @param {object} responseHeaders: An object containing the reponse headers.
 * @param {function} resolve: The Promise's success callback.
 * @param {function} reject: The promise's error callback.
 */
export const handleRequestComplete = (
  status, statusText, responseText,
  responseHeaders, resolve, reject) => {
  if (status !== 200) {
    // Failed.
    reject(new HttpError(status, responseText, statusText));
  } else {
    // Success.
    let response = responseText;
    if (isJson(response)) {
      try {
        response = JSON.parse(response);
      } catch (err) {
        reject(new HttpParseError(responseText, err));
        return;
      }
    } else if (response === 'true' || response === 'false') {
      response = util.toBool(response);
    } else if (util.isNumeric(response)) {
      response = parseFloat(response);
    }
    resolve({ data: response, headers: responseHeaders });
  }
};

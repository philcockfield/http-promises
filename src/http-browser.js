/* global XMLHttpRequest */
import _ from 'lodash';
import Promise from 'bluebird';
import { HttpError, HttpParseError } from './errors';
import { handleRequestComplete } from './shared';



const send = (verb, url, data) => {
  return new Promise((resolve, reject) => {
      let xhr = api.createXhr();
      xhr.open(verb, url);
      if (_.isObject(data)) {
        data = JSON.stringify(data);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      }
      xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            handleRequestComplete(xhr.status, xhr.statusText, xhr.responseText, resolve, reject);
          }
      };
      xhr.send(data);
  });
};


const api = {
  HttpError: HttpError,
  HttpParseError: HttpParseError,

  /**
  * Factory for the XHR object.
  * Swap this method out to a fake object for testing.
  * See: http://sinonjs.org/docs/#server
  */
  createXhr() {
    // NB: Only available when in the browser.
    return new XMLHttpRequest();
  },


  /**
  * Perform a GET operation against the given URL.
  * @param url: URL of the resource.
  * @return promise.
  */
  get(url) { return send('GET', url); },


  /**
  * Performs a POST operation against the given URL.
  *
  *   In REST/Resource-Oriented systems the POST verb
  *   means "create a new resource".
  *
  * @param url:   URL of the resource.
  * @param data:  The data to send (a primitive value or an object,
  *               will be transformed and sent as JSON).
  * @return promise.
  */
  post(url, data) { return send('POST', url, data); },


  /**
  * Performs a PUT operation against the given URL.
  *
  *   In REST/Resource-Oriented systems the PUT verb
  *   means "update a resource".
  *
  * @param url:   URL of the resource.
  * @param data:  The data to send (a primitive value or an object,
  *               will be transformed and sent as JSON).
  * @return promise.
  */
  put(url, data) { return send('PUT', url, data); },


  /**
  * Performs a DELETE operation against the given URL.
  *
  *   In REST/Resource-Oriented systems the DELETE verb
  *   means "remove the resource".
  *
  * @param url:   URL of the resource.
  * @return promise.
  */
  delete(url) { return send('DELETE', url); }
};



export default api;

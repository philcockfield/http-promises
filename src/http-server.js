import R from "ramda";
import nodeUrl from "url";
import nodeHttp from "http";
import nodeHttps from "https";
import Promise from "bluebird";
import { HttpError, HttpParseError } from "./errors";
import { handleRequestComplete } from "./shared";


const send = (verb, url, data, headers = {}) => {
  return new Promise((resolve, reject) => {
      // Prepare the data to send.
      const hasData = data !== undefined;
      if (R.is(Object, data)) {
        data = JSON.stringify(data);
        headers["Content-Type"] = "application/json;charset=UTF-8";
      }
      if (hasData) {
        headers["Content-Length"] = data.toString().length;
      }

      url = nodeUrl.parse(url);
      let options = {
        hostname: url.hostname,
        port: url.port,
        path: url.path,
        method: verb,
        headers: headers,
        protocol: url.protocol
      };

      // Setup the request.
      const httpLibrary = url.protocol === "https:" ? nodeHttps : nodeHttp;
      let req = httpLibrary.request(options, (res) =>  {
            let responseText = "";
            res.setEncoding("utf8");
            res.on("data", (data) => { responseText += data; });
            res.on("end", () => {
              handleRequestComplete(res.statusCode, res.statusMessage, responseText, res.headers, resolve, reject);
            });
      });

      // Listen transport for error.
      // NB: This is not an expected status-code error, but rather
      //     an error with the HTTP connection.
      req.on("error", (err) => { reject(err); });

      // Initiate the request.
      if (hasData) { req.write(data); }
      req.end();
  });
};


/**
 * Creates a new API object.
 */
const getApi = (headers = {}) => {
  headers = R.clone(headers);
  return {
    HttpError: HttpError,
    HttpParseError: HttpParseError,
    headers,


    /**
     * Adds the given key:value pair as a header.
     * @param {string} key:   The name of the header.
     * @param {string} value: The value of the header.
     * @return a new API object with the added header (chainable).
     */
    header(key, value) {
      if (R.isNil(key)) { throw new Error(`A key for the HTTP header is required.`); }
      if (R.isNil(value)) { throw new Error(`A value for the '${ key }' HTTP header is required.`); }
      const result = getApi(headers);
      result.headers[key] = value;
      return result;
    },


    /**
    * Perform a GET operation against the given URL.
    * @param url: URL of the resource.
    * @return promise.
    */
    get(url) { return send("GET", url, undefined, headers); },


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
    post(url, data) { return send("POST", url, data, headers); },


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
    put(url, data) { return send("PUT", url, data, headers); },


    /**
    * Performs a DELETE operation against the given URL.
    *
    *   In REST/Resource-Oriented systems the DELETE verb
    *   means "remove the resource".
    *
    * @param url:   URL of the resource.
    * @return promise.
    */
    delete(url) { return send("DELETE", url, undefined, headers); }
  };
};




const api = getApi();
export default api;

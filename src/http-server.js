import _ from "lodash";
import nodeUrl from "url";
import nodeHttp from "http";
import nodeHttps from "https";
import Promise from "bluebird";
import { HttpError, HttpParseError } from "./errors";
import { handleRequestComplete } from "./shared";


const send = (verb, url, data) => {
  return new Promise((resolve, reject) => {
      // Prepare the data to send.
      const hasData = !_.isUndefined(data);
      let headers = {};
      if (_.isObject(data)) {
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
              handleRequestComplete(res.statusCode, res.statusMessage, responseText, resolve, reject);
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




const api = {
  HttpError: HttpError,
  HttpParseError: HttpParseError,


  /**
  * Perform a GET operation against the given URL.
  * @param url: URL of the resource.
  * @return promise.
  */
  get(url) { return send("GET", url); },

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
  post(url, data) { return send("POST", url, data); },


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
  put(url, data) { return send("PUT", url, data); },


  /**
  * Performs a DELETE operation against the given URL.
  *
  *   In REST/Resource-Oriented systems the DELETE verb
  *   means "remove the resource".
  *
  * @param url:   URL of the resource.
  * @return promise.
  */
  delete(url) { return send("DELETE", url); }
};


export default api;

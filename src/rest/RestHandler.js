const axios = require('axios');
const { HTTP } = require('../utils/Constants');

class RequestHandler {
  constructor(client) {
      this.client = client;
  }

  /**
   * Makes a rest request
   * @param {String} method The method of the rest request
   * @param {String} url The url to do a request
   * @param {String} [data] The data for the request
   * @returns {Object<Data>}
   */

  async request(method, url, data = {}) {
    var methods = ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'];

    if (!methods.includes(method)) return this.client.emit('error', new Error('Invalid HTTP Method!'));

    return await axios({
      method: method,
      url: `${HTTP.BASE}${url}`,
      data: data.data,
      headers: {
        Authorization: `Bot ${this.client.token}`
      }
    });
  }
};

module.exports = RequestHandler;
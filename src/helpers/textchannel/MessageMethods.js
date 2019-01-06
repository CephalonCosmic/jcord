const { ENDPOINTS } = require('../../utils/Constants').HTTP;
const Message = require('../../models/Message');

class MessageMethods {
  constructor(client, channel) {
    Object.defineProperty(this, 'client', { value: client });

    for (var i of Object.entries(channel)) {
      this[i[0]] = i[1];
    };
  }

  /**
   * Creates a message to the channel
   * @param {String} content The content of the message to send
   * @returns {Promise<Message>}
   */

  create(content) {
    return this.client.rest.request("POST", ENDPOINTS.CHANNEL_MESSAGES(this.id), {
      data: {
        content
      }
    }).then(res => {
      return new Message(this.client, res.data);
    });
  }

  /**
   * Deletes a single message
   * @param {Snoflake} message The id of the message to delete
   * @returns {Promise<Message>}
   */

  async delete(message) {
    let msg = await this.singleFetch(message);
    return this.client.rest.request("DELETE", ENDPOINTS.CHANNEL_MESSAGE(this.id, message))
    .then(() => {
      return msg;
    });
  }

  /*async multipleDelete(limit) {
    if (!limit || isNaN(limit)) limit = 50;

    //let messages = await 
  }*/

  /**
   * Fetch a single message
   * @param {Snowflake} message The id of the message
   * @returns {Promise<Message>}
   */

  singleFetch(message) {
    return this.client.rest.request("GET", ENDPOINTS.CHANNEL_MESSAGE(this.id, message))
    .then(res => {
      return new Message(this.client, res.data);
    });
  }

  /**
   * Fetch multiple messages
   * @param {Object} [options] The options for the request
   * @param {Snoflake} [options.after] Get messages after this message id
   * @param {Snoflake} [options.around] Get messages around this message id
   * @param {Snoflake} [options.before] Get messages before this message id
   * @param {Number} [options.limit=50] The amount of messages to fetch
   * @returns {Promise<Message>}
   */

  multipleFetch(options = {}) {
    var query = [];

    if (options.before && typeof options.before === 'string') {
      query.push(`&before=${options.before}`)
    }

    if (options.after && typeof options.after === 'string') {
      query.push(`&after=${options.after}`)
    }

    if (options.around && typeof options.around === 'string') {
      query.push(`&around=${options.around}`)
    }

    return this.client.rest.request("GET", `${ENDPOINTS.CHANNEL_MESSAGES(this.id)}?limit=${options.limit || 50}${query.join('')}`)
      .then(res => {
        return res.data.map(message => {
          return new Message(this.client, message);
      });
    });
  }
};

module.exports = MessageMethods;
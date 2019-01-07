"use strict";

const EventEmitter = require('events').EventEmitter;
const Shard = require('../websocket/Shard');
const Store = require('../utils/Store');
const RestHandler = require('../rest/RestHandler');

/**
 * @extends EventEmitter Represents a Discord Client
 * @prop {Object} [options] Options for the Discord Client
 * @prop {Number|String} [options.shards=1] The amount of shards to use
 * @prop {Boolean} [options.disableEveryone=true] Whether to disable the @everyone ping
 */

class Client extends EventEmitter {
  constructor(options = {}) {
    super(options);
    this.shards = options.shards || 1;
    this.firstShardSent = false;
    this.getAllMembers = options.getAllMembers || false;

    if (this.shards < 1 || (typeof this.shards === 'string' && this.shards !== 'auto')) this.emit('error', new Error('Invalid amount of shards! Must be more than one or use \'auto\''));

    this.token = null;
    this.channels = new Store();
    this.guilds = new Store();
    this.users = new Store();

    this.firstShardSent = false;
    this.rest = new RestHandler(this);
    this.gatewayURL = null;
    Object.defineProperty(this, 'connectedShards', { value: [] });
  }

  get uptime() {
    return this.startTime ? Date.now() - this.startTime : null;
  }

  /**
   * This will start connecting to the gateway using the given bot token
   * @param {String} token The token of the user
   * @returns {Void}
   */

  async start(token) {
    this.token = token;

    let data = await this.rest.request("GET", '/gateway/bot');

    this.gatewayURL = data.data.url;

    if (this.shards === 'auto') {
      let res = await this.rest.request("GET", '/gateway/bot');

      this.shards = res.data.shards;
    };

    for (let i = 0; i < this.shards; i++) {
      setTimeout(() => {
        new Shard(this, i).connect();
      }, i * 6500);
    };
  }
};

module.exports = Client;
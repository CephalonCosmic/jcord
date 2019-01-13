"use strict";

const EventEmitter = require('events').EventEmitter;
const Shard = require('../websocket/Shard');
const Store = require('../utils/Store');
const RestHandler = require('../rest/RestHandler');
const User = require('../models/User');
const { ENDPOINTS } = require('../utils/Constants').HTTP;

/**
 * @extends EventEmitter Represents a Discord Client
 * @prop {Store} channels Where channels are being cached
 * @prop {Store} guilds Where guilds are being cached
 * @prop {String} token The token of the client
 * @prop {Store} users Where users are being cached
 * @prop {Object} [options] Options for the Discord Client
 * @prop {Number|String} [options.shards=1] The amount of shards to use
 * @prop {Boolean} [options.disableEveryone=true] Whether to disable the @everyone ping
 * @prop {Boolean} [options.getAllMembers=false] Whether to fetch all members on each guild regardless of being offline or not
 * @prop {Boolean} [options.storeMessages=false] Whether to store messages in a cache, once the bot restarts the messages in the cache will be gone and can't be re-added automatically
 */

class Client extends EventEmitter {
  constructor(options = {}) {
    super(options);
    this.shards = options.shards || 1;
    this.firstShardSent = false;
    this.getAllMembers = options.getAllMembers || false;
    this.storeMessages = options.storeMessages || false;

    if (this.shards < 1 || (typeof this.shards === 'string' && this.shards !== 'auto')) this.emit('error', new Error('Invalid amount of shards! Must be more than one or use \'auto\''));

    this.token = null;
    this.channels = new Store();
    this.guilds = new Store();
    this.users = new Store();

    this.rest = new RestHandler(this);
    this.gatewayURL = null;
    Object.defineProperty(this, 'connectedShards', { value: [] });
  }

  get uptime() {
    return this.startTime ? Date.now() - this.startTime : null;
  }

  /**
   * Fetches the user from cache, if it doesn't exist use the REST API to fetch it and add to the cache
   * @param {Snowflake} user The id of the user to fetch
   * @returns {Promise<User>}
   */

  getUser(user) {
    if (!this.users.has(user)) {
      return this.rest.request("GET", ENDPOINTS.USER(user))
      .then(res => {
        return this.users.set(res.data.id, new User(this, res.data));
      });
    } else {
      return new Promise((resolve, reject) => {
        return resolve(this.users.get(user));
      });
    };
  }

  /**
   * Makes the bot leave the guild
   * @param {Snowflake} guild The id of the guild
   * @returns {Promise<Boolean>} Will return true if it's a success
   */

  leaveGuild(guild) {
    return this.rest.request("DELETE", ENDPOINTS.GUILD(guild))
    .then(() => {
      return true;
    });
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
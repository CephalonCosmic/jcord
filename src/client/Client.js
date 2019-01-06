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

    if (this.shards < 0 || (typeof shards === 'string' && this.shards !== 'auto')) this.emit('error', new Error('Invalid amount of shards! Must be more than one or use \'auto\''));

    this.token = null;
    this.channels = new Store();
    this.guilds = new Store();
    this.users = new Store();

    this.firstShardSent = false;
    this.rest = new RestHandler(this);
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

    if (this.shards === 'auto') {
      let res = await this.rest.request('GET', '/gateway/bot');

      this.shards = res.data.shards;
    };

    for (var i = 0; i < this.shards; i++) {
      let num = i;
      setTimeout(() => {
        new Shard(this, num).connect();
      }, num * 5000);
    };
  }
};

module.exports = Client;
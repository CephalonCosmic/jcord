"use strict";

const Message = require('../models/Message');
const GuildChannel = require('./GuildChannel');
const { ENDPOINTS } = require('../utils/Constants').HTTP;
const Store = require('../utils/Store');

/**
 * @extends GuildChannel Represens a Guild Text Channel.
 * @prop {Number} rateLimitPerUser Amount of seconds a user has to wait before sending another message (0-120); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected
 * @prop {String?} topic The topic of the text channel.
 * @prop {Snowflake?} lastMessageID The id of the last message sent
 * @prop {String} mention The mention for the channel
 * @prop {Store?} messages The messages of the channel stored in the cache. Will return null if `Client#storeMessages` is false
 * @prop {Snowflake?} parentID The id of the category the channel is in
 * @prop {Object?} parent The category the channel is in
 */

class TextChannel extends GuildChannel {
  constructor(client, data) {
    super(client, data);
    Object.defineProperty(this, 'client', { value: client });

    this.rateLimitPerUser = data.rate_limit_per_user;
    this.topic = data.topic || null;
    this.lastMessageID = data.last_message_id || null;
    this.mention = `<#${this.id}>`;

    if (this.client.storeMessages) {
      this.messages = new Store();
    } else {
      this.messages = null;
    }

    this.parentID = data.parent_id || null;
  }

  get parent() {
    return this.parentID ? this.client.channels.get(this.parentID) : null;
  }

  /**
   * Creates a message to the channel
   * @param {String} content The content of the message
   * @returns {Promise<Message>}
   */

  createMessage(content) {
    return this.client.rest.request("POST", ENDPOINTS.CHANNEL_MESSAGES(this.id), {
      data: {
        content
      }
    }).then(res => {
      return new Message(this.client, res.data);
    });
  }
};

module.exports = TextChannel;
"use strict";

const GuildChannel = require('./GuildChannel');
const MessageMethods = require('../helpers/channel/MessageMethods');

/**
 * @extends GuildChannel Represens a Guild Text Channel.
 * @prop {Number} rateLimitPerUser Amount of seconds a user has to wait before sending another message (0-120); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected
 * @prop {String?} topic The topic of the text channel.
 * @prop {Snowflake?} lastMessageID The id of the last message sent
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
    this.parentID = data.parent_id || null;
  }

  get parent() {
    return this.parentID ? this.client.channels.get(this.parentID) : null;
  }

  get message() {
    return new MessageMethods(this.client, this);
  }
};

module.exports = TextChannel;
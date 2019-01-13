"use strict";

const Store = require('../utils/Store');
const UnavailableGuild = require('./UnavailableGuild');
const TextChannel = require('./TextChannel');
const VoiceChannel = require('./VoiceChannel');
const CategoryChannel = require('./CategoryChannel');
const User = require('./User');
const Member = require('./Member');
const Role = require('./Role');
const { ENDPOINTS } = require('../utils/Constants').HTTP;

/**
 * @extends UnavailableGuild Represents an available guild on Discord
 * @prop {GuildChannel?} afkChannel Represents the afk Channel
 * @prop {Snowflake?} afkChannelID The id of the afk channel
 * @prop {Boolean} available Whether the guild is available or not
 * @prop {Store<GuildChannel>} channel A Store of the Channels in the Guild
 * @prop {Number} createdTimestamp The timestamp in ms when the guild was created
 * @prop {Number} defaultMessageNotificaions The default message notification for the Guild
 * @prop {Store<Emoji>} emojis A Store of Guild Emojis
 * @prop {Array} features An array of guild features
 * @prop {String?} icon The icon hash of the guild
 * @prop {String?} iconURL The url of the guild's icon
 * @prop {Snowflake} id The id of the guild
 * @prop {Boolean} large Whether the guild is large or not, depends on `Client.largeThreshold`
 * @prop {Number} memberCount The guilds's member count
 * @prop {Store<Member>} members The amount of Members that the guild is in
 * @prop {String} name The name of the guild
 * @prop {Member?} owner The member object of the guild owner
 * @prop {Member?} ownerID The id of the guild owner
 * @prop {Array} presences An array of member presence
 * @prop {String} region The region of the guild
 * @prop {Store<Role>} roles A Store of Roles ( Where Roles are cached )
 * @prop {Object?} systemChannel The system channel of the guild
 * @prop {Snowflake?} systemChannelID The id of the system channel
 */

class Guild extends UnavailableGuild {
  constructor(client, data) {
    super(client, data);
    Object.defineProperty(this, 'client', { value: client });

    this.afkChannelID = data.afk_channel_id;
    this.afkTimeout = data.afk_timeout;
    this.applicationID = data.application_id;
    this.channels = new Store();
    this.createdTimestamp = new Date(data.joined_at).getTime();
    this.defaultMessageNotificaions = data.default_message_notifications;
    this.emojis = new Store();
    this.explicitContentFilter = data.explicit_content_filter;
    this.features = data.features;
    this.icon = data.icon || null;
    this.iconURL = data.icon ? `https://cdn.discordapp.com/icons/${data.id}/${this.icon}.png` : null;
    this.large = data.large;
    this.lazy = data.lazy;
    this.memberCount = data.member_count;
    this.members = new Store();
    this.mfaLevel = data.mfa_level;
    this.name = data.name;
    this.ownerID = data.owner_id || null;
    this.presences = data.presences;
    this.region = data.region;
    this.roles = new Store();
    this.shard = data.shard;
    this.splash = data.splash;
    this.systemChannelID = data.system_channel_id;
    this.verificationLevel = data.verification_level;
    this.voiceStates = data.voice_states;

    for (var i = 0; i < data.channels.length; i++) {
      data.channels[i].guild = this;
      switch(data.channels[i].type) {
        case 0: {
          this.channels.set(data.channels[i].id, new TextChannel(this.client, data.channels[i]));
          this.client.channels.set(data.channels[i].id, new TextChannel(this.client, data.channels[i]));
          break;
        }

        case 2: {
          this.channels.set(data.channels[i].id, new VoiceChannel(this.client, data.channels[i]));
          this.client.channels.set(data.channels[i].id, new VoiceChannel(this.client, data.channels[i]));
          break;
        }

        case 4: {
          this.channels.set(data.channels[i].id, new CategoryChannel(this.client, data.channels[i]));
          this.client.channels.set(data.channels[i].id, new CategoryChannel(this.client, data.channels[i]));
          break;
        }

        default: {
          this.client.emit('debug', 'Invalid Guild Channel type Received: ' + data.channels[i].type);
          break;
        }
      };
    };

    for (var i = 0; i < data.roles.length; i++) {
      this.roles.set(data.roles[i].id, new Role(this.client, data.roles[i]));
    };

    for (var i = 0; i < data.members.length; i++) {
      data.members[i].guild = this;

      this.members.set(data.members[i].user.id, new Member(this.client, data.members[i]));
      this.client.users.set(data.members[i].user.id, new User(this.client, data.members[i].user));
    };
  }

  get afkChannel() {
    return this.afkChannelID ? this.channels.get(this.afkChannelID) : null;
  }

  get owner() {
    return this.ownerID ? this.members.get(this.ownerID) : null;
  }

  get systemChannel() {
    return this.systemChannelID ? this.channels.get(this.systemChannelID) : null;
  }

  /**
   * Bans a member from the guild
   * @param {Snowflake} user The id of the member to ban
   * @param {Object} [options] Options for the guild ban
   * @param {Number} [options.days=0] Number of days to delete messages for
   * @param {String} [options.reason=''] Reasom for the ban
   * @returns {Promise<User>}
   */

  ban(user, options = { days: 0, reason: '' }) {
    return this.client.rest.request("PUT", `${ENDPOINTS.GUILD_BAN(this.id, user)}?delete-message-days=${options.days}&reason=${options.reason}`)
    .then(() => {
      return this.client.getUser(user);
    });
  }

  /**
   * Kicks a member from the guild
   * @param {Snowflake} user The id of the member to kick
   * @param {String} reason The reason for the kick
   * @returns {Promise<User>}
   */

  kick(user, reason) {
    return this.client.rest.request("DELETE", `${ENDPOINTS.GUILD_MEMBER(this.id, user)}?reason=${reason}`)
    .then(() => {
      return this.client.getUser(user);
    });
  }

  /**
   * Fetch all the guild channels using the REST API and sends an array of channels that were fetched from the cache
   * @returns {Promise<TextChanne|VoiceChannel|CategoryChannel}
   */

  getChannels() {
    return this.client.rest.request("GET", ENDPOINTS.GUILD_CHANNELS(this.id))
    .then(res => {
      return res.data.map(channel => {
        return this.channels.get(channel.id);
      });
    });
  }

  /**
   * Returns an array of guild invites
   * @returns {Promise<Array<Invite>>}
   */

  getInvites() {
    return this.client.rest.request("GET", ENDPOINTS.GUILD_INVITES(this.id))
    .then(res => {
      return res.data;
    });
  }

  /**
   * Fetches a guild member from the cache, if not present will use the REST API and set it inside the cache
   * @param {Snowflake} user The id of the member
   * @returns {Promise<Member>}
   */

  getMember(user) {
    return this.client.rest.request("GET", ENDPOINTS.GUILD_MEMBER(this.id, user))
    .then(res => {
      if (!this.members.has(res.data.user.id)) {
        return this.members.set(res.data.user.id, new Member(this.client, res.data));
      } else {
        return this.members.get(res.data.user.id);
      }
    });
  }

  /**
   * Similiar to `Client#leaveGuild()`, makes the bot leave the current guild
   * @returns {Promise<Guild>}
   */

  async leave() {
    await this.client.leaveGuild(this.id);
    
    return Promise.resolve(this);
  }

  /**
   * Edits a channel's position
   * @param {Snowflake} channel The id of the channel to set the position of
   * @param {Number} position The new position of the channel
   * @returns {Promise<Channel>}
   */

  modifyChannelPosition(channel, position) {
    return this.client.rest.request("PATCH", ENDPOINTS.GUILD_CHANNEL(this.id, channel), {
      data: {
        id: channel,
        position
      }
    }).then(() => {
      return this.channels.get(channel);
    });
  }

  /**
   * Softbans a member from the guild
   * @param {Snowflake} user The id of the member to softban
   * @param {String} reason The reason for the softban
   * @returns {Promise<User>}
   */

  async softban(user, reason) {
    this.ban(user, { days: 7, reason });
    this.unban(user, reason);

    return await this.client.getUser(user);
  }

  /**
   * Unbans a member from the guild
   * @param {Snowflake} user The id of the member to unban
   * @param {String} reason The reason for the unban
   * @returns {Promise<User>}
   */

  unban(user, reason) {
    return this.client.rest.request("DELETE", `${ENDPOINTS.GUILD_BAN(this.id, user)}?reason=${reason}`)
    .then(() => {
      return this.client.getUser(user);
    });
  }
};

module.exports = Guild;
const Channel = require('./Channel');

/**
 * @extends Channel Represents a Guild Channel
 * @prop {Guild} guild The guild the channel is in
 * @prop {Snowflake} id The id of the guild channel
 * @prop {String} name The name of the guild channel
 * @prop {Array} permissionOverwrites An array of Permission Overwrites for the channel
 * @prop {Number} position The position of the Channel
 * @prop {String} type The type of the channel
 * * `text` If the channel is a text channel
 * * `dm` If the channel is a dm channel
 * * `voice` If the channel is a voice channel
 * * `groupdm` If the channel is a group dm channel
 * * `category` if the channel is a Channel Category
 */

class GuildChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    Object.defineProperty(this, 'client', { value: client });
    
    this.guild = data.guild;
    this.name = data.name;
    this.nsfw = data.nsfw;
    this.permissionOverwrites = data.permission_overwrites;
    this.position = data.position;
  }
};

module.exports = GuildChannel;
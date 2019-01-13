/**
 * @event Client#GUILD_MEMBER_REMOVE
 * @prop {Object} member The member that left the guild
 */

class GuildMemberRemove {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    let guild = this.gateway.client.guilds.get(this.packet.d.guild_id);
    let member = guild.members.get(this.packet.d.user.id);

    guild.members.delete(this.packet.d.user.id);

    this.gateway.client.emit('GUILD_MEMBER_REMOVE', member);
  }
};

module.exports = GuildMemberRemove;
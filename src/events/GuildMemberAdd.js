const Member = require('../models/Member');

/**
 * @event Client#GUILD_MEMBER_ADD
 * @prop {Object} member The new member that joined the guild
 */

class GuildMemberAdd {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    this.packet.d.guild = this.gateway.client.guilds.get(this.packet.d.guild_id);
    var member = new Member(this.gateway.client, this.packet.d);

    this.packet.d.guild.members.set(member.user.id, member);

    this.gateway.client.emit('GUILD_MEMBER_ADD', member);
  }
};

module.exports = GuildMemberAdd;
/**
 * @event Client#GUILD_MEMBER_UPDATE
 * @prop {Member} member The member's new properties
 */

class GuildMemberUpdate {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    this.guild = this.gateway.client.guilds.get(this.packet.d.guild_id);
    this.member = this.guild.members.get(this.packet.d.user.id);

    if (!this.packet.d.roles.includes(this.guild.id)) this.packet.d.roles.push(this.guild.id);

    if (this.packet.d.roles.length > this.member.roles.size) {
      var role = this.member.guild.roles.get(this.packet.d.roles[this.packet.d.roles.length - 2]);

      return this.member.roles.set(role.id, role);
    }
    if (this.packet.d.roles.length < this.member.roles.size) {
      var oldRoleIDs = this.member.roles.keyArray();
      var removedRoles = oldRoleIDs.filter(val => !this.packet.d.roles.includes(val));

      removedRoles.forEach(role => {
        this.member.roles.delete(role);
      });
    };

    this.gateway.client.emit('GUILD_MEMBER_UPDATE', this.member)
  }
};

module.exports = GuildMemberUpdate;
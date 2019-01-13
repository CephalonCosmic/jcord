/**
 * @event Client#GUILD_ROLE_DELETE
 * @prop {Role} role The role deleted
 */

class RoleDelete {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    let guild = this.packet.d.guild_id ? this.gateway.client.guilds.get(this.packet.d.guild_id) : null;
    let role = guild.roles.get(this.packet.d.role.id);
    let members = guild.members.filter(member => member.roles.has(role.id));

    for (var i = 0; i < members.length; i++) {
      members[i].roles.delete(role.id);
    };

    guild.roles.delete(role.id);

    this.gateway.client.emit('GUILD_ROLE_DELETE', role);
  }
};

module.exports = RoleDelete;
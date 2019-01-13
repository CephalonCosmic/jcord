const Role = require('../models/Role');

/**
 * @event Client#GUILD_ROLE_UPDATE
 * @prop {Role} role The role updated
 */

class RoleUpdate {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    let guild = this.packet.d.guild_id ? this.gateway.client.guilds.get(this.packet.d.guild_id) : null;
    let role = new Role(this.gateway.client, this.packet.d.role);
    let members = guild.members.filter(member => member.roles.has(role.id));

    for (var i = 0; i < members.length; i++) {
      members[i].roles.set(role.id, role);
    };

    guild.roles.set(role.id, role);

    this.gateway.client.emit('GUILD_ROLE_UPDATE', role);
  }
};

module.exports = RoleUpdate;
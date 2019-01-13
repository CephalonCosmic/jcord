const Role = require('../models/Role');

/**
 * @event Client#GUILD_ROLE_CREATE
 * @prop {Role} role The new role created
 */

class RoleCreate {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    let guild = this.packet.d.guild_id ? this.gateway.client.guilds.get(this.packet.d.guild_id) : null;

    guild.roles.set(this.packet.d.role.id, new Role(this.gateway.client, this.packet.d.role));

    this.gateway.client.emit('GUILD_ROLE_CREATE', new Role(this.gateway.client, this.packet.d.role));
  }
};

module.exports = RoleCreate;
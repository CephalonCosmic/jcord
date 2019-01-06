const ClientUser = require('../models/ClientUser');

/**
 * @event Client#READY Represents the ready event
 */

class Ready {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;

    this.gateway.lastHeartbeatSentOrIdentify = Date.now();
    this.gateway.client.user = new ClientUser(this.gateway.client, this.packet.d.user);
    this.gateway.guildLength = this.packet.d.guilds.length;
  }

  execute() {
    this.user = this.packet.d.user;

    if (!this.gateway.guildLength) {
      console.warn('Bot logged in was in 0 guilds! This is not recommended, caching will be disabled! Please add this bot in a guild!');
      this.gateway.client.emit('READY');
    }
  }
};

module.exports = Ready; 
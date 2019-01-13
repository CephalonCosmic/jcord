const User = require('../models/User');

/**
 * @event Client#PRESENCE_UPDATE
 * @prop {Object} data The updated new data
 * @prop {User} data.user The user's new data
 * @prop {String} data.status The user's new status
 * @prop {Array} data.activities An array of the user's activities
 * @prop {Object?} data.game null, or the user's activity
 */

class PresenceUpdate {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    let data = {}

    this.gateway.client.users.set(this.packet.d.user.id, new User(this.gateway.client, this.packet.d.user));

    data.user = this.gateway.client.users.get(this.packet.d.user.id);
    data.status = this.packet.d.status;
    data.activities = this.packet.d.activities;
    data.game = this.packet.d.game || null

    this.gateway.client.emit('PRESENCE_UPDATE', data);
  }
};

module.exports = PresenceUpdate;
const Message = require('../models/Message');

class MessageCreate {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    if (!this.gateway.status) return;
    let message = new Message(this.gateway.client, this.packet.d);

    return this.gateway.client.emit('MESSAGE_CREATE', message);
  }
};

module.exports = MessageCreate;
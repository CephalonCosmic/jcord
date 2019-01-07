const Message = require('../models/Message');
const User = require('../models/User');

class MessageCreate {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    if (this.gateway.shardStatus !== 'ready') return;
    
    if (!this.gateway.client.users.has(this.packet.d.author.id)) {
      this.gateway.client.users.set(this.packet.d.author.id, new User(this.gateway.client, this.packet.d.author));
    };

    let message = new Message(this.gateway.client, this.packet.d);

    return this.gateway.client.emit('MESSAGE_CREATE', message);
  }
};

module.exports = MessageCreate;
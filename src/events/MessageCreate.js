const Message = require('../models/Message');
const User = require('../models/User');

class MessageCreate {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    if (this.gateway.shardStatus !== 'ready') return;
    let channel = this.gateway.client.channels.get(this.packet.d.channel_id);
    
    if (!this.gateway.client.users.has(this.packet.d.author.id)) {
      this.gateway.client.users.set(this.packet.d.author.id, new User(this.gateway.client, this.packet.d.author));
    };

    let message = new Message(this.gateway.client, this.packet.d);

    if (this.gateway.client.storeMessages) {
      channel.messages.set(message.id, message)
    };

    return this.gateway.client.emit('MESSAGE_CREATE', message);
  }
};

module.exports = MessageCreate;
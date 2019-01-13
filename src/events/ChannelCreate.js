const TextChannel = require('../models/TextChannel');
const VoiceChannel = require('../models/VoiceChannel');
const CategoryChannel = require('../models/CategoryChannel');
const DMChannel = require('../models/DMChannel');

class ChannelCreate {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    this.packet.d.guild = this.gateway.client.guilds.get(this.packet.d.guild_id);

    switch(this.packet.d.type) {
      case 0: 
        this.gateway.client.channels.set(this.packet.d.id, new TextChannel(this.gateway.client, this.packet.d));
        break;

      case 1:
        this.gateway.client.channels.set(this.packet.d.id, new DMChannel(this.gateway.client, this.packet.d));
        break;

      case 2:
        this.gateway.client.channels.set(this.packet.d.id, new VoiceChannel(this.gateway.client, this.packet.d));
        break;

      case 4:
        this.gateway.client.channels.set(this.packet.d.id, new CategoryChannel(this.gateway.client, this.packet.d));
        break;
    };

    return this.gateway.client.emit('CHANNEL_CREATE', this.gateway.client.channels.get(this.packet.d.id));
  }
};

module.exports = ChannelCreate;
const User = require('../models/User');

/**
 * @event Client#GuildMembersChunk Represents the ready event
 */

class Ready {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    let guild = this.gateway.client.guilds.get(this.packet.d.guild_id);

    for (var i = 0; i < this.packet.d.members.length; i++) {
      guild.members.set(this.packet.d.members[i].user.id, this.packet.d.members[i]);
      this.gateway.client.users.set(this.packet.d.members[i].user.id, new User(this.gateway.client, this.packet.d.members[i].user));
    };

    this.gateway.totalMemberCountOfGuildMemberChunk += this.packet.d.members.length;
    this.gateway.client.guilds.set(guild.id, guild);
            
    if (this.gateway.totalMemberCountOfGuildMemberChunk === this.gateway.totalMemberCount && this.gateway.status !== 'ready') {
      this.gateway.client.emit('SHARD_READY', this.gateway.shardData);
      this.gateway.client.connectedShards.push(this.gateway.shard);
      this.gateway.shardStatus = 'ready';

      if (this.gateway.client.connectedShards.length === this.gateway.client.shards) {
        this.gateway.client.startTime = Date.now();
        this.gateway.client.emit('READY')
        this.gateway.status = 'ready';
      };
    }

    this.gateway.client.emit('GUILD_MEMBERS_CHUNK', this.packet.d);
  }
};

module.exports = Ready; 
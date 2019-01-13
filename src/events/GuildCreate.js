const Guild = require('../models/Guild');

/**
 * @event Client#Guild Represents the guild create event
 */

class Ready {
  constructor(gateway, packet) {
    this.gateway = gateway;
    this.packet = packet;
  }

  execute() {
    this.packet.d.shard = this.gateway.shardData;
    this.gateway.client.guilds.set(this.packet.d.id, new Guild(this.gateway.client, this.packet.d));
    if (this.gateway.client.getAllMembers) {
      this.gateway.client.emit('debug', 'Client#getAllMembers was on! Will request all guild members');
      this.gateway.fetchAllMembers(this.packet.d.id);
    }

    let guild = this.gateway.client.guilds.get(this.packet.d.id);

    this.gateway.totalMemberCount += guild.memberCount;
    this.gateway.guildLength--;

    if (!this.gateway.guildLength) {
      this.gateway.client.emit('GUILD_CREATE', guild);

      if (!this.gateway.client.getAllMembers) {
        this.gateway.shardStatus = 'ready';
        this.gateway.client.emit('SHARD_READY', this.packet.d.shard);
        this.gateway.client.shards.set(this.packet.d.shard.id, this.packet.d.shard);
        this.gateway.client.connectedShards.push(this.gateway.shard);
      };

      if (this.gateway.status !== 'ready' && !this.gateway.client.getAllMembers && this.gateway.client.connectedShards.length === this.gateway.client.shardCount) {
        this.gateway.client.startTime = Date.now();
        this.gateway.status = 'ready';
        this.gateway.client.emit('READY');
      };
    };
  }
};

module.exports = Ready; 
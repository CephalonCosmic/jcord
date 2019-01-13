const Websocket = require('ws');
const os = require('os');

const Ready = require('../events/Ready');
const GuildCreate = require('../events/GuildCreate');
const GuildMembersChunk = require('../events/GuildMembersChunk');
const MessageCreate = require('../events/MessageCreate');
const ChannelCreate = require('../events/ChannelCreate');
const GuildMemberAdd = require('../events/GuildMemberAdd');
const GuildMemberUpdate = require('../events/GuildMemberUpdate');
const GuildMemberRemove = require('../events/GuildMemberRemove');
const PresenceUpdate = require('../events/PresenceUpdate');
const RoleCreate = require('../events/RoleCreate');
const RoleDelete = require('../events/RoleDelete');
const RoleUpdate = require('../events/RoleUpdate');

class Shard {
  constructor(client, shard) {
    this.client = client;
    this.shard = shard;
    this.ws = new Websocket(`${this.client.gatewayURL}/?v=6&encoding=json`);
    this.lastHeartbeatAck = 0;
    this.lastHeartbeatSentOrIdentify = 0;
    this.totalMemberCountOfGuildMemberChunk = 0;
    this.totalMemberCount = 0;
    this.interval = null;
    this.heartbeatInterval = null;
    this.status = false;
    this.shardData = { id: this.shard, latency: Infinity };
    this.shardStatus = null;
  }

  connect() {
    this.onMessage();
  }

  onEvent(packet) {
    switch(packet.t) {
      case 'READY':
        if (!packet.d.guilds.length) {
          new Ready(this, packet).execute();
        };

        new Ready(this, packet);
        break;

      case 'GUILD_CREATE':
        new GuildCreate(this, packet).execute();
        break;

      case 'GUILD_MEMBERS_CHUNK':
        new GuildMembersChunk(this, packet).execute();
        break;

      case 'MESSAGE_CREATE':
        new MessageCreate(this, packet).execute();
        break;

      case 'CHANNEL_CREATE':
        new ChannelCreate(this, packet).execute();
        break;

      case 'CHANNEL_DELETE':
        this.client.channels.delete(packet.d.id);
        break;

      case 'GUILD_MEMBER_ADD':
        new GuildMemberAdd(this, packet).execute();
        break;
      
      case 'GUILD_MEMBER_UPDATE':
        new GuildMemberUpdate(this, packet).execute();
        break;

      case 'GUILD_MEMBER_REMOVE':
        new GuildMemberRemove(this, packet).execute();
        break;

      case 'PRESENCE_UPDATE':
        new PresenceUpdate(this, packet).execute();
        break;

      case 'GUILD_ROLE_CREATE':
        new RoleCreate(this, packet).execute();
        break;

      case 'GUILD_ROLE_DELETE':
        new RoleDelete(this, packet).execute();
        break;

      case 'GUILD_ROLE_UPDATE':
        new RoleUpdate(this, packet).execute();
        break;
    };
  }

  onMessage() {
    this.ws.on('message', (data) => {
      const packet = JSON.parse(data);

      switch(packet.op) {
        case 10: {
          this.startHeartbeat(packet.d.heartbeat_interval);
          break;
        }

        case 0: {
          this.onEvent(packet);
          break;
        }

        case 11: {
          this.lastHeartbeatAck = Date.now();
          this.shardData.latency = this.lastHeartbeatAck - this.lastHeartbeatSentOrIdentify;
          break;
        }

        case 9: {
          this.client.emit('debug', `Shard: ${this.shard} received an Opcode 9 ! We will try to reconnect`);
          if (!packet.d) {
            setTimeout(() => {
              this.send({ op: 2, d: {
                  token: this.client.token,
                  properties: {
                    $os: os.platform(),
                    $browser: 'JCord',
                    $device: os.type() === 'Windows_NT' ? 'Windows' : os.type()
                  },
                  shard: [this.shard, this.client.shards]
                }
              });  
            }, 2500)
          };
          break;
        }
      }
    });
  }

  startHeartbeat(interval) {
    this.client.emit('debug', `Starting shard: ${this.shard}`);
    this.lastHeartbeatSentOrIdentify = Date.now();
    this.send({ op: 1, d: null });
    this.send({ op: 2, d: {
        token: this.client.token,
        properties: {
          $os: 'jcord',
          $browser: 'jcord',
          $device: 'jcord'
        },
        shard: [this.shard, this.client.shards]
      }
    });  
    
    this.interval = setInterval(() => {
      this.lastHeartbeatSentOrIdentify = Date.now();
      this.send({ op: 1, d: null });
    }, interval);
  }

  send(data) {
    return this.ws.send(JSON.stringify(data));
  }

  /**
   * Sends a Guild Member Chunk to the given guild(s)
   * @param {Snowflake|Array<Snowflake>} guilds Id of the guild(s) to get offline members for
   * @returns {Void}
   */

  fetchAllMembers(guilds) {
    return this.send({ op: 8, d: {
        guild_id: guilds,
        query: "",
        limit: 0
      }
    });
  }
};

module.exports = Shard;
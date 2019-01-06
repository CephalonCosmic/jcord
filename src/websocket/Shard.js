const Websocket = require('ws');

const Ready = require('../events/Ready');
const GuildCreate = require('../events/GuildCreate');
const GuildMembersChunk = require('../events/GuildMembersChunk');
const MessageCreate = require('../events/MessageCreate');

class Shard {
  constructor(client, shard) {
    this.client = client;
    this.shard = shard;
    this.ws = new Websocket('wss://gateway.discord.gg/?v=6&encoding=json');
    this.lastHeartbeatAck = 0;
    this.lastHeartbeatSentOrIdentify = 0;
    this.totalMemberCountOfGuildMemberChunk = 0;
    this.totalMemberCount = 0;
    this.interval = null;
    this.heartbeatInterval = null;
    this.status = false;
  }

  connect() {
    this.onMessage();
  }

  onEvent(packet) {
    switch(packet.t) {
      case 'READY': {
        new Ready(this, packet);
        break;
      }

      case 'GUILD_CREATE': {
        new GuildCreate(this, packet).execute();
        break;
      }

      case 'GUILD_MEMBERS_CHUNK': {
        new GuildMembersChunk(this, packet).execute();
        break;
      }

      case 'MESSAGE_CREATE': {
        new MessageCreate(this, packet).execute();
        break;
      }
    };
  }

  onMessage() {
    this.ws.on('message', (data) => {
      const packet = JSON.parse(data);

      switch(packet.op) {
        case 10: {
          this.lastHeartbeatAck = Date.now();
          this.startHeartbeat(packet.d.heartbeat_interval);
          break;
        }

        case 0: {
          this.onEvent(packet);
          break;
        }

        case 11: {
          this.lastHeartbeatAck = Date.now();
          break;
        }

        case 9: {
          console.log(packet.d);
          this.client.emit('debug', `Received Opcode 9, will reconnect Shard ${this.shard}`);
          if (!packet.d) {
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
          };
          break;
        }
      }
    });
  }

  startHeartbeat(interval) {
    this.client.emit('debug', `Sending shard: ${this.shard}`);
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
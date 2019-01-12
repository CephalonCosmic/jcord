class Message {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });

    this.activity = data.activity || null;
    this.application = data.application || null;
    this.attachments = data.attachments;
    this.author = this.client.users.has(data.author.id) ? this.client.users.get(data.author.id) : this.client.users.set(data.author.id, data.author);
    this.channel = this.client.channels.get(data.channel_id) || this.client.emit('ERROR', new Error('Message Created but no Channel Received!'));
    this.content = data.content;
    this.createdTimestamp = new Date(data.timestamp).getTime();
    this.editedTimestamp = new Date(data.edited_timestamp).getTime() || null;
    this.embeds = data.embeds;
    this.id = data.id;
    this.mentionedEveryone = data.mention_everyone;
    this.mentions = data.mentions.map(user => {
      return this.client.users.get(user.id);
    });
    this.pinned = data.pinned;
    this.roleMentions = data.mention_roles;
    this.tts = data.tts;
    this.type = data.type;
  }

  get channelMentions() {
    var channels = [];
    const regex = /<#(\d+)>/g;
    let result;

    while ((result = regex.exec(this.content)) !== null) {
      channels.push(this.client.channels.get(result[1]));
    } 

    return channels;
  }

  get member() {
    return this.channel.guild ? this.channel.guild.members.get(this.author.id) : null;
  }
};

module.exports = Message;
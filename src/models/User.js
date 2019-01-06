class User {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });

    this.avatar = data.avatar || null;
    this.avatarURL = this.avatar ? (this.avatar.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.gif` : `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}`) : `https://cdn.discordapp.com/embed/avatars/${data.discriminator % 5}.png`;
    this.bot = data.bot;
    this.discriminator = data.discriminator;
    this.id = data.id;
    this.username = data.username;
  }

  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  toString() {
    return `<@${this.id}>`;
  }
};

module.exports = User;
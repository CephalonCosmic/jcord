module.exports = {
  GATEWAY: {
    VERSION: 6
  },
  HTTP: {
    VERSION: 7,
    get BASE() {
      return `https://discordapp.com/api/v${this.VERSION}`
    },
    ENDPOINTS: {
      GATEWAY: '/gateway',

      /* User */
      USER: (userID) => `/users/${userID}`,
      USER_CHANNELS: (userID) => `/users/${userID}/channels`,
      USER_GUILD: (guildID) => `/users/@me/guilds/${guildID}`,
      USERS: `/users`,

      /* Channels */
      CHANNELS: (channelID) => `/channels/${channelID}`,
      CHANNEL_INVITES: (channelID) => `/channels/${channelID}/invites`,
      CHANNEL_MESSAGE: (channelID, messageID) => `/channels/${channelID}/messages/${messageID}`,
      CHANNEL_MESSAGES: (channelID) => `/channels/${channelID}/messages`,
      CHANNEL_BULKDELETE: (channelID) => `/channels/${channelID}/messages/bulk-delete`,
      CHANNEL_PIN_MESSAGES: (channelID, messageID) => `/channels/${channelID}/pins/${messageID}`,
      CHANNEL_PINNED_MESSAGES: (channelID) => `/channels/${channelID}/pins`,
      CHANNEL_WEBHOOKS: (channelID) => `/channels/${channelID}/webhooks`,

      /* Guild */
      GUILDS: (guildID) => `/guilds/${guildID}`,
      GUILD_BAN: (guildID, userID) => `/guilds/${guildID}/bans/${userID}`,
      GUILD_BANS: (guildID) => `/guilds/${guildID}/bans`,
      GUILD_CHANNELS: (guildID) => `/guilds/${guildID}/channels`,
      GUILD_INVITES: (guildID) => `/guilds/${guildID}/invites`,
      GUILD_MEMBER: (guildID, userID) => `/guilds/${guildID}/members/${userID}`,
      GUILD_MEMBERS: (guildID) => `/guilds/${guildID}/members`,
      GUILD_REGIONS: (guildID) => `/guilds/${guildID}/regions`,
      GUILD_PRUNE: (guildID) => `/guilds/${guildID}/prune`,
      GUILD_ROLE: (guildID, roleID) => `/guilds/${guildID}/roles/${roleID}`,
      GUILD_MEMBER_ROLE: (guildID, userID, roleID) => `/guilds/${guildID}/members/${userID}/roles/${roleID}`
    }
  },

  CHANNEL_TYPES: [
    "text",
    "dm",
    "voice",
    "groupdm",
    "category"
  ]
};
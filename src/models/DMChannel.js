const Channel = require('./Channel');
const User = require('./User');

/**
 * @extends Channel Represens a DM Channel.
 * @prop {Snowflake?} lastMessageID The id of the last message sent
 * @prop {Array<User>} recipients An array of user recipients on the DM Channel
 */

class DMChannel extends Channel {
  constructor(client, data) {
    super(client, data);
    Object.defineProperty(this, 'client', {
      value: client
    });

    this.lastMessageID = data.last_message_id || null;
    this.recipients = data.recipients.map(user => {
      return this.client.users.has(user.id) ? this.client.users.get(user.id) : this.client.users.set(user.id, new User(this.client, user))
    });
  }
};

module.exports = DMChannel;
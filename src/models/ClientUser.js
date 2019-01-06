const User = require('./User');

class ClientUser extends User {
  constructor(client, data) {
    super(client, data);
    Object.defineProperty(this, 'client', { value: client });

    this.email = data.email || null;
    this.locale = data.locale || null;
    this.mfaEnabled = data.mfa_enabled;
    this.verified = data.verified;
  }
};

module.exports = ClientUser;
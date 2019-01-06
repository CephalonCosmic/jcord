class Role {
  constructor(client, data) {
    Object.defineProperty(this, 'client', { value: client });
    
  }
};

module.exports = Role;
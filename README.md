# JCord Rewrite
JCord Rewrite was created because the main JCord had caching problems which still can't be resolved. And that's why JCord Rewrite was created to re-create JCord in a much better way  

## Installation
`$ npm install --save KevvyCodes/jcord-rewrite`

## Documentation
Currently no Documentation for Rewrite!

## Expected Usage
**WARNING: THIS USAGE ONLY WORKS FOR JCORD-REWRITE AND NOT THE NON-UPDATED ONE!**

```js
const JCord = require('jcord');

class MyBot extends JCord.Client {
  constructor(token, options) {
    super(token, options);
    this.prefix = '!';
  }
};

const client = new MyBot('BOT TOKEN', { shards: 'auto' });

client.on('SHARD_READY', (shard) => console.log(`Shard ${shard.id} is ready!`));

client.on('READY', () => console.log(`Logged in as ${client.user.username}!`));

client.on('MESSAGE_CREATE', (msg) => {
  let args = msg.content.slice(client.prefix.length).split(/ +/g);
  let cmd = args.shift().toLowerCase();

  if (msg.content.indexOf(client.prefix) !== 0) return;

  if (cmd === 'ping') {
    return msg.channel.message.create('pong!');
  } else if (cmd === 'uptime') {
    return msg.channel.message.create(`My current uptime in ms: \`${client.uptime}ms\``);
  }
});

client.start();
```

## To-Do List
- [x] Put events into seperate files  
- [x] Add Sharding Support ( Still needs more testing )  
- [ ] Add shard latency support
- [ ] Finish all methods

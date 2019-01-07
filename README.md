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
  constructor(options) {
    super(options);
    this.prefix = '!';
  }
};

const client = new MyBot({ shards: 'auto' });

client.on('SHARD_READY', (shard) => console.log(`Shard ${shard.id} has been loaded and ready to receive other events.`));

client.on('READY', () => console.log(`Logged in as ${client.user.username}!`));

client.on('MESSAGE_CREATE', (msg) => {
  if (!msg.channel.guild) return;

  let args = msg.content.slice(client.prefix.length).split(/ +/g);
  let cmd = args.shift().toLowerCase();

  if (msg.content.indexOf(client.prefix) !== 0) return;

  if (cmd === 'ping') {
    return msg.channel.message.create(`Pong! Shard: ${msg.channel.guild.shard.id} Took \`${msg.channel.guild.shard.latency}ms\``);
  } else if (cmd === 'uptime') {
    return msg.channel.message.create(`My current uptime in ms: \`${client.uptime}ms\``);
  }
});

client.start('BOT TOKEN');
```

## To-Do List
- [x] Put events into seperate files  
- [x] Add Sharding Support ( Still needs more testing )  
- [x] Add shard latency support
- [ ] Finish all methods

## Problems
- Caching Problems ( Sometimes )  
- Slow login ( Due to the delay )  

## Notes
- Sharding is implemented, but might still have issues. We also give a 6.5 Second Delay for shard, meaning Once shard 0 is sent, we will do a timeout of 6.5 seconds before sending a new shard. If the shard fails the connect, it will try to login once more with a delay of 2.5 seconds.  

- Our caching is having slight ( real slight ) problems, and we're trying our best to fix this.  

- `Client#fetchAllMembers`, if true will take longer to login. It's because it's actually requesting **ALL** Guild Members the bot is connected to, whether it's offline or not. Meaning **all** members will be cached, this is a good fix for the caching problem.  

- If you're wandering, "If i use sharding, does the DMs count?". And the answer is yes, DMs are part of the shards, but it is only sent on the first shard, a.k.a Shard 0  

- If your shard amount is more than your bot's guild amount, it will have errors. We suggest using "auto" as the shard parameters, so it we will use the Recommended Shard amount from Discord.
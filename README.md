# JCord
This repo was made to continue the outdated repo of [jcord](https://github.com/Boujee0040/jcord). This is also more updated and has sharding and more features!

## Installation
`$ npm install --save KevvyCodes/jcord`

## Documentation
Currently no Documentation for this version!

## Expected Usage
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
    return msg.channel.createMessage(`Pong! Shard: ${msg.channel.guild.shard.id} Took \`${msg.channel.guild.shard.latency}ms\``);
  } else if (cmd === 'uptime') {
    return msg.channel.createMessage(`My current uptime in ms: \`${client.uptime}ms\``);
  }
});

client.start('BOT TOKEN');
```  

**HERE IS AN EXAMPLE OF THE COMMAND CREATOR**  
```js
const { CommandCreator } = require('jcord');
const client = new CommandCreator({ prefix: '!' });

// We can register the commands on each shard so that we are sure it is being loaded/overwritten every time a shard is complete. You can also make this load without waiting for every shard to be finished by moving the code outside of the "SHARD_READY" event

client.on('SHARD_READY', () => {
  client.registerCommand('ping', (msg) => {
    msg.channel.createMessage(`Pong! Took: \`${msg.channel.guild.shard.latency}ms\``)
  }, { guildOnly: true });

  // This command uses our special feature, which is the args handling feature!
  client.registerCommand('greet', (msg, { greeted_user }) => {
    msg.channel.createMessage(`${greeted_user}, ${msg.author} is greeting you! :wave:`);
  }, {
    guildOnly: true,
    args: [
      {
        key: 'greeted_user',
        type: 'User',
        prompt: 'Please mention a user to greet!'
      }
    ]
  });

  client.registerCommand('random-number', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { aliases: [ 'randomNum' ] });
});

client.on('READY', () => console.log(`Client is now logged in! (${client.user.tag} - ${client.user.id})`));

client.start('My Bot Token');
```

## To-Do List
- [x] Put events into seperate files  
- [x] Add Sharding Support ( Still needs more testing )  
- [x] Add shard latency support
- [ ] Finish all methods  
- [x] Simple bot creator, **not complete but usable**

## Problems
- Caching Problems ( Sometimes )  
- Slow login ( Due to the delay )  

## Notes
- About the Command Creator feature, we're using cache to create commands, but for the guild prefix, you need the package `depo` installed. If you guys have a much better suggestion for the "database", please open an issue. We need one that is easy to install, create. **YOU NEED TO INSTALL THE MASTER VERSION OF DEPO AND NOT THE STABLE ONE, TO INSTALL THE MASTER VERSION, TYPE `npm install boltxyz/depo`**

- Sharding is implemented, but might still have issues. We also give a 6.5 Second Delay for shard, meaning Once shard 0 is sent, we will do a timeout of 6.5 seconds before sending a new shard. If the shard fails the connect, it will try to login once more with a delay of 2.5 seconds.  

- Our caching is having slight ( real slight ) problems, and we're trying our best to fix this.  

- `Client#fetchAllMembers`, if true will take longer to login. It's because it's actually requesting **ALL** Guild Members the bot is connected to, whether it's offline or not. Meaning **all** members will be cached, this is a good fix for the caching problem.  

- If you're wondering, "If i use sharding, does the DMs count?". And the answer is yes, DMs are part of the shards, but it is only sent on the first shard, a.k.a Shard 0  

- If your shard amount is more than your bot's guild amount, it will have errors. We suggest using "auto" as the shard parameters, so it we will use the Recommended Shard amount from Discord.

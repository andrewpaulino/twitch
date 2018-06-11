const tmi = require('tmi.js'); // Twitch module.
require('dotenv').config();
const axios = require('axios');
let commandPrefix = '!';

// NOTE: add offstream when no one can steal it.

let opts = {
  identity: {
    username: 'theprogrammingbot',
    password: process.env.UAUTH
  },
  channels: ['PynkRanger']
};

let knownCommands = { info, donation, wins };

function info(target, context) {
  const About = `@${
    context.username
  } Hi, my name is Andrew; I am a relatively new full-stack developer, versed primarily in Javascript. Most of the time I will either be working on a project or grinding Leetcode. Feel free to comment on bugs or solutions in the chat.`;
  sendMessage(target, context, About);
}

function wins(target, context, params) {
  let message;
  const AxiosHeaders = {
    headers: { 'TRN-Api-Key':prcoess.env.TRN }
  };
  const username = params.join(' ');
  axios
    .get(
      `https://api.fortnitetracker.com/v1/profile/pc/${username}`,
      AxiosHeaders
    )
    .then(res => {
      let wins = res.data.recentMatches[0].top1;

      if (0 >= wins) {
        message = `@${context.username} Wow, ${wins} wins you suck!`;
      } else {
        message = `@${context.username} Congrats, you have ${wins} win(s)`;
      }
      sendMessage(target, context, message);
    })
    .catch(err => {
      return err;
    });
}

function donation(target, context) {
  const donationLink = `@${
    context.username
  } https://streamlabs.com/andrewpaulino`;

  sendMessage(target, context, donationLink);
}
const sendMessage = (target, context, message) => {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message);
  } else {
    client.say(target, message);
  }
};

// !register theprogrammingdude

// API request sent to database with corresponding view'

// !balance
let client = new tmi.client(opts);

// Register our event handlers (defined below):
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('disconnected', onDisconnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in:
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(
      `[${target} (${context['message-type']})] ${context.username}: ${msg}`
    );
    return;
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ');
  // The command name is the first (0th) one:
  const commandName = parse[0];
  // The rest (if any) are the parameters:
  const params = parse.splice(1);

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName];
    // Then call the command with parameters:
    command(target, context, params);
    console.log(`* Executed ${commandName} command for ${context.username}`);
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`);
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler(reason) {
  console.log(`Womp womp, disconnected: ${reason}`);
  process.exit(1);
}

const tmi = require('tmi.js'); // Twitch module.

let commandPrefix = '!';

// NOTE: add offstream when no one can steal it.

let opts = {
  identity: {
    username: theprogrammingbot,
    password: 'oauth:' + 'not yet'
  },
  channels: [theprogrammingdude]
};

let knownCommands = { info, donation, lang, leaked, setup, currency };

const info = (target, context) => {
  const About =
    'Hi, my name is Andrew; I am a relatively new full-stack developer, versed primarily in Javascript. Most of the time I will either be working on a project or grinding Leetcode. Feel free to comment on bugs or solutions in the chat.';
  sendMessage(target, context, About);
};

const sendMessage = (target, context, message) => {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message);
  } else {
    client.say(target, message);
  }
};

import tmi from 'tmi.js';
import PubSub from 'pubsub-js';

import { twitchConfig } from '../config';

class Twitch {
  options = {
    options: {
      clientId: twitchConfig.clientId,
      debug: false
    },
    connection: {
      secure: true,
      reconnect: true,
      maxReconnectAttempts: 10,
      maxReconnectInterval: 20000,
      reconnectInterval: 1000
    },
    channels: []
  };

  constructor(channelName, identity) {
    console.log('new twitch');
    if (channelName) this.options.channels.push(channelName);
    if (identity) this.options.identity = identity;

    this.tryToJoinTimeout = null;
    this.client = tmi.client(this.options);

    this.client.on('message', (channel, userstate, message) => PubSub.publish('twitch.message', {channel, userstate, message}));
    this.client.connect();
  }

  join(channelName) {
    return new Promise((resolve, reject) => {
      this.client.getChannels().forEach(chan => this.client.part(chan));

      const tryToJoin = () => {
        if (this.client.readyState() === 'OPEN') {
          console.log(this.client.readyState());
          this.client
          .join(channelName)
          .then(data => {
            console.log(`Connected to ${data}`);
            resolve(data);
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
        } else {
          this.tryToJoinTimeout = setTimeout(tryToJoin, 500);
          // console.error(
          //   `Can't connect to ${channelName}, as the client is in state '${this.client.readyState()}'`
          // );
          // reject(this.client.readyState());
        }
      };

      if (this.tryToJoinTimeout) {
        clearTimeout(this.tryToJoinTimeout);
        this.tryToJoinTimeout = null;
      }
      tryToJoin();
    });
  }

  login(identity) {
    if (this.client.opts.identity.password === identity.password) {
      console.log('Wont login, already logged in!');
      return;
    }
    if (this.client) {
      this.client.disconnect();
      this.client.getChannels().forEach(chan => this.client.part(chan));
      delete this.client;
    }
    this.client = tmi.client({
      ...this.options,
      identity
    });

    this.client.on('message', this.receiveMessage);
    this.client.connect();
  }
}

export default new Twitch();

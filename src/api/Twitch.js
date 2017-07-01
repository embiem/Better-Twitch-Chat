import tmi from 'tmi.js';

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

  constructor(channelName) {
    if (channelName) this.options.channels.push(channelName);

    this.client = tmi.client(this.options);
    this.client.connect();
  }

  join(channelName) {
    return new Promise((resolve, reject) => {
      if (this.client.readyState() === 'OPEN') {
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
        console.error(
          `Can't connect to ${channelName}, as the client is in state '${this.client.readyState()}'`
        );
        reject(this.client.readyState());
      }
    });
  }

  login(userName, token) {
    this.client = tmi.client({
      ...this.options,
      identity: {
        username: userName,
        password: token
      }
    });
    this.client.connect();
  }
}

export default Twitch;

import tmi from 'tmi.js';

class Twitch {
  constructor(debug) {
    const options = {
      options: {
        clientId: null,
        debug: false
      },
      connection: {
        reconnect: true,
        maxReconnectAttempts: 10,
        maxReconnectInterval: 20000,
        reconnectInterval: 1000
      },
      channels: []
    };
    this.client = tmi.client(options);
    if (debug) {
      this.client.on('message', (channel, userstate, message, self) => {
        console.log(
          `Received message '${message}' in ${channel}`,
          userstate,
          self
        );
      });
      this.client.on('action', function(channel, userstate, message, self) {
        console.log(
          `Received Action-message '${message}' in ${channel}`,
          userstate,
          self
        );
      });
      this.client.on('logon', () => {
        console.log('Log-in successful!');
      });
      this.client.on('connected', function(address, port) {
        console.log(`Connected to '${address}' @${port}`);
      });
      this.client.on('disconnected', function(reason) {
        console.log(`Disconnected! Reason: '${reason}'`);
      });
      this.client.on('emotesets', (sets, obj) => {
        console.log(`Received emote-set '${sets}'`, obj);
      });
      this.client.on(
        'subscription',
        (channel, username, method, message, userstate) => {
          console.log(
            `New subscriber '${username}' in ${channel}`,
            method,
            userstate
          );
        }
      );
      this.client.on('cheer', function(channel, userstate, message) {
        console.log(
          `New ${userstate.bits} cheer in ${channel}: '${message}'`,
          userstate
        );
      });
      this.client.on('whisper', (from, userstate, message, self) => {
        console.log(
          `Received Whisper '${message}' from '${from}'`,
          userstate,
          self
        );
      });
      this.client.on(
        'resub',
        (channel, username, months, message, userstate, methods) => {
          console.log(
            `${months} months Resub from '${username}' in ${channel} with message '${message}'`,
            methods,
            userstate
          );
        }
      );
      this.client.on('mod', (channel, username) => {
        console.log(`New mod '${username}' in '${channel}'`);
      });
      this.client.on('unmod', function(channel, username) {
        console.log(`'${username}' was unmodded in '${channel}'`);
      });
      this.client.on('mods', (channel, mods) => {
        console.log(`Mods in '${channel}' are:`, mods);
      });
      this.client.on('hosted', (channel, username, viewers, autohost) => {
        console.log(
          `'${channel}' got hosted by ${username} with ${viewers} viewers. autohost:`,
          autohost
        );
      });
      this.client.on('hosting', (channel, target, viewers) => {
        console.log(
          `'${channel}' is now hosting '${target}' with ${viewers} viewers.`
        );
      });
      this.client.on('unhost', (channel, viewers) => {
        console.log(`'${channel}' no longer hosts with ${viewers} viewers.`);
      });
    }
    this.client.connect();
  }

  join(channelName) {
    return new Promise((resolve, reject) => {
      if (this.client.readyState() === 'OPEN') {
        this.client
          .join(channelName)
          .then((data) => {
            console.log(`Connected to ${data}`);
            resolve(data);
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      } else {
        console.error(`Can't connect to ${channelName}, as the client is in state '${this.client.readyState()}'`);
        reject(this.client.readyState());
      }
    });
  }
}

export default Twitch;

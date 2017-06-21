import React, { Component } from 'react';
import { connect } from 'react-redux';

import { twitchConfig } from './config';

import Menu from './components/menu/Menu';
import Navigation from './components/menu/Navigation';
import ConnectForm from './components/forms/Connect';
import Username from './components/chat/Username';

import { uiActions } from './redux/actions';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false };
  }

  render() {
    const { dispatch, ui, user } = this.props;

    // TODO have a chat/Message.js component and parse the message there
    // including parsing of emotes & links
    const formatEmotes = (text, emotes) => {
      var splitText = text.split('');
      for (var i in emotes) {
        var e = emotes[i];
        for (var j in e) {
          var mote = e[j];
          if (typeof mote == 'string') {
            mote = mote.split('-');
            mote = [parseInt(mote[0]), parseInt(mote[1])];
            var length = mote[1] - mote[0],
              empty = Array.apply(null, new Array(length + 1)).map(function() {
                return '';
              });
            splitText = splitText
              .slice(0, mote[0])
              .concat(empty)
              .concat(splitText.slice(mote[1] + 1, splitText.length));
            splitText.splice(
              mote[0],
              1,
              '<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' +
                i +
                '/3.0">'
            );
          }
        }
      }
      return splitText.join('');
    };

    const renderChatMessages = () => {
      return ui.messages.map((msg, idx) =>
        <div className="Chat-Message" key={idx}>
          <Username channel={msg.channel.substr(1)} userstate={msg.user} />
          <div
            className="Message"
            dangerouslySetInnerHTML={{
              __html: formatEmotes(msg.text, msg.user.emotes)
            }}
          />
        </div>
      );
    };

    const renderContent = () => {
      if (!ui.connectedTo || ui.connectedTo.length <= 0) {
        return (
          <ConnectForm
            onConnectClicked={() => {
              this.client = window.Twitch.join(ui.channelName).then(
                channelName => {
                  dispatch(uiActions.setConnectedTo(channelName));
                  console.warn(
                    `Is connected to ${channelName}! TODO set state here`
                  );
                },
                err => {
                  dispatch(uiActions.setConnectedTo(''));
                  console.error(`Could not connect to channel!`, err);
                }
              );
            }}
            onChannelNameChanged={(event, newValue) => {
              dispatch(uiActions.setChannelName(newValue));
            }}
          />
        );
      } else {
        // TODO create a chat-feed
        return (
          <div>
            <ConnectForm
              onConnectClicked={
                  () => {
                    window.Twitch.client.say(
                      `#${ui.channelName}`,
                      ui.sayMessage
                    );
                  }
              }
              onChannelNameChanged={(event, newValue) => {
                dispatch(uiActions.setSayMessage(newValue));
              }}
            />
            <div className="Chat">
              {renderChatMessages()}
            </div>
          </div>
        );
      }
    };

    return (
      <div className="App">
        <Navigation
          title="Better Twitch Chat"
          onLeftIconClicked={() =>
            this.setState({ drawerOpen: !this.state.drawerOpen })}
        />
        <Menu
          title="Menu"
          entries={[{ id: 1, name: '#WTF' }, { id: 2, name: '#FML' }]}
          open={this.state.drawerOpen}
          onCloseClicked={() => this.setState({ drawerOpen: false })}
          onEntryClicked={id => {
            console.warn('TODO menu entry clicked with id ', id);
            this.setState({ drawerOpen: false });
          }}
        />

        <div className="Content">

          <div>
            {(() => {
              if (!user.twitchToken.valid)
                return (
                  <input
                    value="Twitch Sign-In"
                    type="button"
                    onClick={() => {
                      window.location = `https://api.twitch.tv/kraken/oauth2/authorize?client_id=${twitchConfig.clientId}&redirect_uri=${twitchConfig.redirectURI}&response_type=token&scope=chat_login`;
                    }}
                  />
                );
            })()}
          </div>

          {renderContent()}

        </div>
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(App);

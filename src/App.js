import React, { Component } from 'react';
import { connect } from 'react-redux';

import Menu from './components/menu/Menu';
import Navigation from './components/menu/Navigation';
import ConnectForm from './components/forms/Connect';

import { uiActions } from './redux/actions';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false };
  }

  render() {
    const { dispatch, ui } = this.props;

    const renderContent = () => {
      if (!ui.connectedTo || ui.connectedTo.length <= 0) {
        return (
          <ConnectForm
            onConnectClicked={() => {
              this.client = window.Twitch
                .join(ui.channelName)
                .then(channelName => {
                  dispatch(uiActions.setConnectedTo(channelName));
                  console.warn(`Is connected to ${channelName}! TODO set state here`);
                }, err => {
                  dispatch(uiActions.setConnectedTo(''));
                  console.error(`Could not connect to channel!`, err);
                });
            }}
            onChannelNameChanged={(event, newValue) => {
              dispatch(uiActions.setChannelName(newValue));
            }}
          />
        );
      } else {
        return ui.messages.reverse().map((msg, idx) => (<p key={idx}><span style={{color: msg.user.color}}>{msg.user['display-name']}</span>: {msg.text}</p>));
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

          {renderContent()}

        </div>
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui
}))(App);

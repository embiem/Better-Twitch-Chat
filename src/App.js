import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Menu from './components/menu/Menu';
import Navigation from './components/menu/Navigation';
import ConnectForm from './components/forms/Connect';
import Chat from './components/chat/Chat';
import Popup from './components/popup/Popup';

import { uiActions } from './redux/actions';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false, channelToJoin: '', joinChannel: false};
  }

  render() {
    return (
      <Router>
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
          <Route exact path="/" render={() => {
            if (!this.state.joinChannel) {
              return (
                <ConnectForm
                  onChannelNameChanged={(event, newVal) => this.setState({...this.state, channelToJoin: newVal})}
                  onConnectClicked={() => this.setState({...this.state, joinChannel: true})}
                />
              )
            } else {
              return (
                <Redirect to={`/chat/${this.state.channelToJoin}`}/>
              );
            }
          }} />
          <Route path="/chat/:channel" component={Chat} />
          <Route path="/popup" component={Popup} />
        </div>
      </Router>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(App);

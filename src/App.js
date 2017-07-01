import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';

import Menu from './components/menu/Menu';
import Navigation from './components/menu/Navigation';
import Chat from './components/chat/Chat';
import Home from './components/home/Home';

import { uiActions } from './redux/actions/'

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false };

    this._renderMenu = this._renderMenu.bind(this);
    this._renderNav = this._renderNav.bind(this);
    this._renderSnackbar = this._renderSnackbar.bind(this);
  }

  _renderMenu() {
    return (
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
    );
  }

  _renderNav() {
    const { user } = this.props;
    const isLoggedIn =
      user.firebaseUser && !user.firebaseUser.isAnonymous && user.twitchUser;

    return (
      <Navigation
        title="Better Twitch Chat"
        onLeftIconClicked={() =>
          this.setState({ drawerOpen: !this.state.drawerOpen })}
        onRightIconClicked={() => {
          if (!isLoggedIn)
            window.open(
              `${window.location.origin}/popup`,
              'name',
              'height=585,width=400'
            );
        }}
        userData={
          isLoggedIn
            ? {
                name: user.twitchUser.display_name
                  ? user.twitchUser.display_name
                  : user.firebaseUser.displayName,
                image: user.twitchUser.logo
                  ? user.twitchUser.logo
                  : user.firebaseUser.photoURL
              }
            : null
        }
      />
    );
  }

  _renderSnackbar() {
    const { ui, dispatch } = this.props;
    return (
      <Snackbar
        open={ui.snackbar.open}
        message={ui.snackbar.message}
        autoHideDuration={4000}
        onRequestClose={() => dispatch(uiActions.hideSnackbar())}
      />
    );
  }

  render() {
    return (
      <div className="App">
        {this._renderNav()}
        {this._renderMenu()}
        {this._renderSnackbar()}

        <Route exact path="/" component={Home} />
        <Route path="/chat/:channel" component={Chat} />
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(App);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import Media from 'react-media';

import Menu from './components/menu/Menu';
import Navigation from './components/menu/Navigation';
import Chat from './components/chat/Chat';
import Train from './components/train/Train';
import Home from './components/home/Home';

import { uiActions } from './redux/actions/';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { drawerOpen: false, chosenMenuItem: 0 };

    this._renderMenu = this._renderMenu.bind(this);
    this._renderNav = this._renderNav.bind(this);
    this._renderSnackbar = this._renderSnackbar.bind(this);
  }

  componentDidUpdate() {
    if (this.state.chosenMenuItem !== 0) {
      this.setState({ chosenMenuItem: 0 });
    }
  }

  _renderMenu() {
    const { ui } = this.props;

    if (this.state.chosenMenuItem === 1) {
      return <Redirect to={`/`} />;
    } else if (this.state.chosenMenuItem === 2) {
      return <Redirect to={`/train/`} />;
    } else if (this.state.chosenMenuItem === 3) {
      return <Redirect to={`/chat/${ui.currentChannel}`} />
    }
    const entries = [{ id: 1, name: 'Home' }, { id: 2, name: 'Train' }];
    if (ui.currentChannel) {
      entries.push({ id: 3, name: `Chat: '${ui.currentChannel}'`});
    }
    return (
      <Menu
        title="Menu"
        entries={entries}
        open={this.state.drawerOpen}
        onCloseClicked={() => this.setState({ drawerOpen: false })}
        onEntryClicked={id => {
          this.setState({ chosenMenuItem: id, drawerOpen: false });
        }}
      />
    );
  }

  _renderNav() {
    const { user } = this.props;
    const isLoggedIn =
      user.firebaseUser && !user.firebaseUser.isAnonymous && user.twitchUser;

    const nav = titleText =>
      <Navigation
        title={titleText}
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
      />;
    return (
      <Media query="(max-width: 500px)">
        {matches => (matches ? nav('BTC') : nav('Better Twitch Chat'))}
      </Media>
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

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/chat/:channel" component={Chat} />
          <Route path="/train" component={Train} />
          {/*If nothing fits, go back to Home */}
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(App);

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import firebase from 'firebase';
import { Provider } from 'react-redux';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import config from './config';

import Twitch from './api/Twitch';
import { userActions, uiActions } from './redux/actions';

import './index.css';

// Needed for onTouchTap in material-ui components
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// redux setup
const store = require('./redux/configureStore').configure();
store.subscribe(() => {
  // Log out the state for debugging purpose
  // TODO Remove the store.subscribe for production
  const state = store.getState();
  console.log('New State', state);
});

// Init firebase
firebase.initializeApp(config);
const auth = firebase.auth();
auth.onAuthStateChanged(user => {
  if (user) {
    // signed-in
    store.dispatch(userActions.signIn(user));
  } else {
    // signed-out
    store.dispatch(userActions.signOut());
  }
});

// Init Twitch
window.Twitch = new Twitch();
window.Twitch.client.on('message', (channel, userstate, message, self) => {
  store.dispatch(uiActions.addMessage({user: userstate, text: message, channel}));
});
window.Twitch.client.on('join', (channel, username, self) => {
  if (self)
    store.dispatch(uiActions.setConnectedTo(channel));
});
window.Twitch.client.on('part', (channel, username, self) => {
  if (self)
    store.dispatch(uiActions.setConnectedTo(''));
});
ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();

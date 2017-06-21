import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import firebase from 'firebase';
import { Provider } from 'react-redux';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import config, { twitchConfig } from './config';

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

// Init Twitch
window.Twitch = new Twitch();

const assignTwitchCallbacks = () => {
  window.Twitch.client.on('message', (channel, userstate, message, self) => {
    store.dispatch(
      uiActions.addMessage({ user: userstate, text: message, channel })
    );
  });
  window.Twitch.client.on('join', (channel, username, self) => {
    if (self) store.dispatch(uiActions.setConnectedTo(channel));
  });
  window.Twitch.client.on('part', (channel, username, self) => {
    if (self) store.dispatch(uiActions.setConnectedTo(''));
  });
};
assignTwitchCallbacks();

// get Twitch access token if we were redirected back after login
const idxAccessToken = window.location.hash.indexOf('#access_token=');
if (idxAccessToken >= 0) {
  const idxScope = window.location.hash.indexOf('&scope=');
  const accessToken = window.location.hash.substring(
    '#access_token='.length,
    idxScope > idxAccessToken ? idxScope : null
  );
  const scope = window.location.hash.substring(idxScope + '&scope='.length);

  window.Twitch.client.api(
    {
      url: `https://api.twitch.tv/kraken?client_id=${twitchConfig.clientId}&oauth_token=${accessToken}`
    },
    function(err, res, body) {
      if (!err) {
        store.dispatch(userActions.setTwitchToken(body.token));
        if (body.token.valid) {
          window.Twitch.login(body.token.user_name, accessToken);
          assignTwitchCallbacks();
        }
      } else {
        console.error(err);
      }
    }
  );
}

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

// Render
ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

registerServiceWorker();

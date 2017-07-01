import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import firebase from 'firebase';
import { Provider } from 'react-redux';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import config, { twitchConfig } from './config';

import { userActions } from './redux/actions';

import './index.css';

// Needed for onTouchTap in material-ui components
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// redux setup
const store = require('./redux/configureStore').configure();

// Init firebase
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch(userActions.setFirebaseUser(user));
    // get the twitchUser
    firebase
      .database()
      .ref(`twitchUserData/${user.uid}/`)
      .once('value')
      .then(snapshot => store.dispatch(userActions.setTwitchUser(snapshot.val())))
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

//registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import firebase from 'firebase';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Popup from './components/popup/Popup';
import config from './config';

import { userActions, uiActions } from './redux/actions';

import './index.css';
import 'font-awesome/css/font-awesome.css';

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
      .then(snapshot =>
        store.dispatch(userActions.setTwitchUser(snapshot.val()))
      );

    firebase
      .database()
      .ref(`twitchAccessToken/${user.uid}/`)
      .once('value')
      .then(snapshot =>
        store.dispatch(userActions.setTwitchToken(snapshot.val()))
      );

    store.dispatch(uiActions.showSnackbar(`Hey ${user.displayName}, you're logged-in!`));
  }
});
// Render
ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router>
        <div>
          {window.location.pathname.indexOf('popup') >= 0
            ? <Route path="/popup" component={Popup} />
            : <Route path="/" component={App} />}
        </div>
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);

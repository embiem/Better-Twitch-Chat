import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import firebase from 'firebase';
import PubSub from 'pubsub-js';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App';
import Popup from './components/popup/Popup';
import config from './config';
import Twitch from './api/Twitch';
import NeuralNet from './api/NeuralNet';

import { userActions, uiActions, chatActions } from './redux/actions';

import './index.css';
import 'font-awesome/css/font-awesome.css';

// Needed for onTouchTap in material-ui components
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// redux setup
const store = require('./redux/configureStore').configure();

// Twitch callback
PubSub.subscribe('twitch.message', (msg, data) =>
  store.dispatch(
    chatActions.handleMessageReceived(data.channel, data.userstate, data.message)
  )
);

// Util function to load the global neural net, if no private one exists
const loadGlobalNet = () => {
  firebase
    .database()
    .ref(`netGlobal/`)
    .once('value')
    .then(snapshot => {
      const val = snapshot.val();
      if (val) {
        NeuralNet.loadFromJSON({
          netJSON: val.netJSON,
          dictJSON: val.dictJSON
        });
        console.log('Loaded NN with trainResult: ', val.trainResult);
        store.dispatch(
          uiActions.showSnackbar(`Global Neural Net loaded.`)
        );
      } else {
        store.dispatch(
          uiActions.showSnackbar(`Could not retrieve global NN!`)
        );
      }
    });
};

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

    firebase
      .database()
      .ref(`nets/${user.uid}/`)
      .once('value')
      .then(snapshot => {
        const val = snapshot.val();
        if (val) {
          NeuralNet.loadFromJSON({
            netJSON: val.netJSON,
            dictJSON: val.dictJSON
          });
          console.log('Loaded NN with trainResult: ', val.trainResult);
          store.dispatch(
            uiActions.showSnackbar(`YOUR Neural Net successfully loaded!`)
          );
        } else {
          loadGlobalNet();
        }
      });

    firebase
      .database()
      .ref(`messages/${user.uid}/`)
      .once('value')
      .then(snapshot =>
        store.dispatch(uiActions.setVotedMessages(snapshot.val()))
      );

    store.dispatch(
      uiActions.showSnackbar(`Hey ${user.displayName}, you're logged-in!`)
    );
  } else {
    loadGlobalNet();
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

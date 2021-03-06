import React, { Component } from 'react';

import FoldingCube from '../loading/FoldingCube';

import firebase from 'firebase';

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = { displayMessage: 'Please wait...' };
  }
  /**
     * Returns the value of the given URL query parameter.
     */
  getURLParameter(name) {
    return (
      decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(// eslint-disable-line
          window.location.search
        ) || [null, ''])[1]
          .replace(/\+/g, '%20')
      ) || null
    );
  }

  /**
     * Returns the ID of the Firebase project.
     */
  getFirebaseProjectId() {
    return firebase.app().options.authDomain.split('.')[0];
  }

  componentDidMount() {
    const isDebugMode = window.location.href.indexOf('localhost') >= 0;

    var code = this.getURLParameter('code');
    var state = this.getURLParameter('state');
    var error = this.getURLParameter('error');
    if (error) {
      document.body.innerText =
        'Error back from the Twitch auth page: ' + error;

      this.setState({
        displayMessage: `Error while trying to log-in your Twitch account: ${error}`
      });
    } else if (!code) {
      // Start the auth flow.
      window.location.href = `https://us-central1-${this.getFirebaseProjectId()}.cloudfunctions.net/redirect${isDebugMode
        ? `?debug=1`
        : ``}`;
      this.setState({ displayMessage: `Connecting to Twitch...` });
    } else {
      /**
       * This callback is called by the JSONP callback of the 'token' Firebase Function with the Firebase auth token.
       */
      window.tokenReceived = function(data) {
        if (data.token) {
          firebase.auth().signInWithCustomToken(data.token).then(function() {
            window.close();
          });
        } else {
          console.error(data);
          document.body.innerText =
            'Error in the token Function: ' + data.error;

          this.setState({
            displayMessage: `Error while finalizing your log-in: ${data.error}`
          });
        }
      };
      // Use JSONP to load the 'token' Firebase Function to exchange the auth code against a Firebase custom token.
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // This is the URL to the HTTP triggered 'token' Firebase Function.
      // See https://firebase.google.com/docs/functions.
      var tokenFunctionURL =
        'https://us-central1-' +
        this.getFirebaseProjectId() +
        '.cloudfunctions.net/token';
      script.src = `${tokenFunctionURL}?code=${encodeURIComponent(
        code
      )}&state=${encodeURIComponent(
        state
      )}&callback=window.tokenReceived${isDebugMode ? `&debug=1` : ``}`;

      document.head.appendChild(script);
      this.setState({ displayMessage: `Finalizing Log-in...` });
    }
  }

  render() {
    return (
      <div>
        <FoldingCube />
        <div style={{ textAlign: 'center' }}>
          {this.state.displayMessage}
        </div>
      </div>
    );
  }
}

export default Popup;

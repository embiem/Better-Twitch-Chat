/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

// Firebase Setup
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
});

const OAUTH_REDIRECT_URI = `https://${process.env
  .GCLOUD_PROJECT}.firebaseapp.com/popup`;
const OAUTH_REDIRECT_URI_DEV = 'http://localhost:3000/popup';

const OAUTH_SCOPES = 'chat_login user_read';

/**
 * Creates a configured simple-oauth2 client for Twitch.
 */
function twitchOAuth2Client(isDev) {
  // Twitch OAuth 2 setup
  const credentials = {
    client: {
      id: isDev
        ? functions.config().twitch.client_id_dev
        : functions.config().twitch.client_id,
      secret: isDev
        ? functions.config().twitch.client_secret_dev
        : functions.config().twitch.client_secret
    },
    auth: {
      tokenHost: 'https://api.twitch.tv',
      tokenPath: '/kraken/oauth2/token',
      authorizePath: '/kraken/oauth2/authorize'
    }
  };
  return require('simple-oauth2').create(credentials);
}

/**
 * Redirects the User to the Twitch authentication consent screen. Also the 'state' cookie is set for later state
 * verification.
 */
exports.redirect = functions.https.onRequest((req, res) => {
  const isDev = req.originalUrl.toLowerCase().indexOf('debug') >= 0;

  const oauth2 = twitchOAuth2Client(isDev);
  cookieParser()(req, res, () => {
    const state = req.cookies.state || crypto.randomBytes(20).toString('hex');
    console.log(`${isDev ? `DEV: ` : ``}Setting verification state:`, state);
    res.cookie('state', state.toString(), {
      maxAge: 3600000,
      secure: true,
      httpOnly: true
    });
    const redirectUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: isDev ? OAUTH_REDIRECT_URI_DEV : OAUTH_REDIRECT_URI,
      scope: OAUTH_SCOPES,
      state: state
    });
    console.log(`${isDev ? `DEV: ` : ``}Redirecting to:`, redirectUri);
    res.redirect(redirectUri);
  });
});

/**
 * Exchanges a given Twitch auth code passed in the 'code' URL query parameter for a Firebase auth token.
 * The request also needs to specify a 'state' query parameter which will be checked against the 'state' cookie.
 * The Firebase custom auth token, display name, photo URL and Instagram acces token are sent back in a JSONP callback
 * function with function name defined by the 'callback' query parameter.
 */
exports.token = functions.https.onRequest((req, res) => {
  const isDev = req.originalUrl.toLowerCase().indexOf('debug') >= 0;
  const oauth2 = twitchOAuth2Client(isDev);
  try {
    cookieParser()(req, res, () => {
      console.log(
        `${isDev ? `DEV: ` : ``}Received verification state:`,
        req.cookies.state
      );
      console.log(`${isDev ? `DEV: ` : ``}Received state:`, req.query.state);
      if (!req.cookies.state) {
        throw new Error(
          'State cookie not set or expired. Maybe you took too long to authorize. Please try again.'
        );
      } else if (req.cookies.state !== req.query.state) {
        throw new Error('State validation failed');
      }
      console.log(`${isDev ? `DEV: ` : ``}Received auth code:`, req.query.code);
      oauth2.authorizationCode
        .getToken({
          code: req.query.code,
          redirect_uri: isDev ? OAUTH_REDIRECT_URI_DEV : OAUTH_REDIRECT_URI
        })
        .then(results => {
          console.log(
            `${isDev ? `DEV: ` : ``}Auth code exchange result received:`,
            results
          );

          // We have a Twitch access token now.
          const accessToken = results.access_token;

          // request a twitch user ID and the username here
          var request = require('request');
          var options = {
            url: 'https://api.twitch.tv/kraken/user',
            headers: {
              Accept: 'application/vnd.twitchtv.v5+json',
              'Client-ID': isDev
                ? functions.config().twitch.client_id_dev
                : functions.config().twitch.client_id,
              Authorization: `OAuth ${accessToken}`
            }
          };
          // response-data of this request: https://dev.twitch.tv/docs/v5/reference/users/#get-user
          request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
              var info = JSON.parse(body);
              var username = info.name;
              var userId = info._id;
              var email = info.email;
              var emailVerified = info.email_verified;
              var logoUrl = info.logo;
              console.log(`${isDev ? `DEV: ` : ``}Received user-info:`, info);

              // Create a Firebase account and get the Custom Auth Token.
              createFirebaseAccount(
                userId,
                username,
                logoUrl,
                email,
                emailVerified,
                accessToken,
                info
              ).then(firebaseToken => {
                // Serve an HTML page that signs the user in and updates the user profile.
                res.jsonp({ token: firebaseToken });
              });
            }
          });
        });
    });
  } catch (error) {
    return res.jsonp({ error: error.toString });
  }
});

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /twitchAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
function createFirebaseAccount(
  userId,
  username,
  logoUrl,
  email,
  emailVerified,
  accessToken,
  twitchUserData
) {
  // The UID we'll assign to the user.
  const uid = `twitch:${userId}`;

  // Save the access token to the Firebase Realtime Database.
  const databaseAccesTokenTask = admin
    .database()
    .ref(`/twitchAccessToken/${uid}`)
    .set(accessToken);

  // Save the twitch user-data to the Firebase Realtime Database.
  const databaseUserDataTask = admin
    .database()
    .ref(`/twitchUserData/${uid}`)
    .set(twitchUserData);

  // Create or update the user account.
  const userCreationTask = admin
    .auth()
    .updateUser(uid, {
      displayName: username,
      photoURL: logoUrl,
      email: email,
      emailVerified: emailVerified
    })
    .catch(error => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
          uid: uid,
          displayName: username,
          photoURL: logoUrl,
          email: email,
          emailVerified: emailVerified
        });
      }
      throw error;
    });

  // Wait for all async task to complete then generate and return a custom auth token.
  return Promise.all([
    userCreationTask,
    databaseAccesTokenTask,
    databaseUserDataTask
  ]).then(() => {
    // Create a Firebase custom auth token.
    return admin.auth().createCustomToken(uid).then(token => {
      console.log('Created Custom token for UID "', uid, '" Token:', token);
      return token;
    });
  });
}

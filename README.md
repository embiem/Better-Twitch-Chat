
A hobby project, which tries to implement a more comfortable & feature-rich chat app for Twitch.
PoC developed during the Capstone project of Udacity's Machine Learning Nanodegree.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
Its guide can be found [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## 3rd party libraries

* brain.js - for classifying messages as "show" or "hide" using Neural Networks
* firebase - to persist data and authenticate the user via Twitch
* material-ui - easy & fast UI/UX
* mimir - bag-of-words model
* react - front-end framework <3
* redux - state <3
* redux-thunk - for those awesome actions that actually aren't actions
* tmi.js - Twitch api & chat connection

## New Clone

Basically follow the steps here.

1. Create the ``src/config.js`` file with firebaseConfig & twitchConfig.
2. Create the `functions/service-account.json` file [Docs](https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app)
3. Set the twitch clientId & clientSecret as GCloud env variables [Docs](https://github.com/firebase/functions-samples/tree/master/instagram-auth)
  1. `firebase functions:config:set twitch.client_id="yourClientID" twitch.client_secret="yourClientSecret"`
  2. for local dev, also set `firebase functions:config:set twitch.client_id_dev="yourClientDevID" twitch.client_secret_dev="yourClientDevSecret"`


## Table of Contents

- [Sending Feedback](#sending-feedback)
- [Folder Structure](#folder-structure)
- [Something Missing?](#something-missing)

## Sending Feedback

We are always open to [your feedback](https://github.com/mBeierl/Better-Twitch-Chat/issues).

## Folder Structure

TODO some info about the structure

```
root/
  functions/ (contains the code for firebase-functions)
  node/ (model evaluation and verification, as well as the used dataset)
  public/
    index.html
    favicon.ico
  src/
    api/
      NeuralNet.js (the NN implementation, extending brain.js's functionality)
      Twitch.js (additional layer on top of tmi.js to connect to Twitch)
    components/ (contains all the React components used in the Web App)
    redux/ (contains all actions and reducers used to manage state)
    App.js
    index.js
```

## Something Missing?

If you have ideas for more “How To” recipes that should be on this page, [let us know](https://github.com/mBeierl/Better-Twitch-Chat/issues).

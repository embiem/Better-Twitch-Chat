A hobby project, which tries to implement a more comfortable & feature-rich chat app for Twitch.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
Its guide can be found [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

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
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```

## Something Missing?

If you have ideas for more “How To” recipes that should be on this page, [let us know](https://github.com/mBeierl/Better-Twitch-Chat/issues).

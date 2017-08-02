import firebase from 'firebase';

export const setFirebaseUser = user => ({
  type: 'SET_FIREBASE_USER',
  user
});

export const setTwitchUser = user => ({
  type: 'SET_TWITCH_USER',
  user
});

export const setTwitchToken = accessToken => ({
  type: 'SET_TWITCH_TOKEN',
  accessToken
});

export const setTraining = active => ({
  type: 'SET_TRAINING',
  active
});

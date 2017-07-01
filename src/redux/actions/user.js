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

export const startSignOut = () => (dispatch, getState) => {
  firebase
    .auth()
    .signOut()
    .then(result => console.log('sign-out result:', result))
    .catch(err => console.error('sign-out error:', err));
};

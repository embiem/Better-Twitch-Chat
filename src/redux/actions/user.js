import firebase from 'firebase';

export const signIn = user => ({
  type: 'SIGN_IN',
  user
});

export const signOut = () => ({
  type: 'SIGN_OUT'
});

export const setTwitchToken = (token) => ({
  type: 'SET_TWITCH_TOKEN',
  token
});

export const startSignIn = () => (dispatch, getState) => {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      console.log('result', result);
      dispatch(signIn(result.user));
    })
    .catch(function(err) {
      console.error(`Could not sign in. Code ${err.code}: ${err.message}`);
    });
};

export const startSignOut = () => (dispatch, getState) => {
  firebase
    .auth()
    .signOut()
    .then(result => console.log('sign-out result:', result))
    .catch(err => console.error('sign-out error:', err));
};

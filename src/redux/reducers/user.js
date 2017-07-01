const initialState = {
  firebaseUser: null,
  twitchUser: null,
  twitchToken: ''
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_FIREBASE_USER':
      return {
        ...state,
        firebaseUser: action.user
      };

    case 'SET_TWITCH_USER':
      return {
        ...state,
        twitchUser: action.user
      };

    case 'SET_TWITCH_TOKEN':
      return {
        ...state,
        twitchToken: action.accessToken
      };

    default:
      return state;
  }
}

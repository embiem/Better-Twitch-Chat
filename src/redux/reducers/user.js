const initialState = {
  signedIn: false,
  userData: undefined,
  twitchToken: ''
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        ...state,
        userData: action.user,
        signedIn: true
      };

    case 'SIGN_OUT':
      return {
        ...state,
        signedIn: false
      };

    case 'SET_TWITCH_TOKEN':
      return {
        ...state,
        twitchToken: action.token
      };

    default:
      return state;
  }
}

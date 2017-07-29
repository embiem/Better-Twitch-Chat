const initialState = {};

export default function votedMessagesReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_VOTED_MESSAGES':
      return {
        ...action.messages
      };

    case 'SET_VOTED_MESSAGE':
    {
      const newState = {...state};
      newState[action.key] = action.val;
      return newState;
    }

    case 'UPDATE_VOTED_MESSAGE_LIKE':
    {
      const newState = {...state};
      newState[action.key].liked = action.liked;
      return newState;
    }

    case 'REMOVE_VOTED_MESSAGE':
    {
      const newState = {...state};
      delete newState[action.key];
      return newState;
    }

    default:
      return state;
  }
}

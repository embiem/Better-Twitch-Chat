const initialState = {
  sayMessage: '',
  messages: [],
  snackbar: {
    open: false,
    message: ''
  }
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_SAY_MESSAGE':
      return {
        ...state,
        sayMessage: action.message
      };

    case 'ADD_MESSAGE':
    {
      const newMessages = [...state.messages];
      newMessages.push(action.messageObj);
      return {
        ...state,
        messages: newMessages
      };
    }

    case 'SHOW_SNACKBAR':
      return {
        ...state,
        snackbar: {
          open: true,
          message: action.message
        }
      };

    default:
      return state;
  }
}

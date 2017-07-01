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

    case 'REMOVE_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages.slice(0, action.index),
          ...state.messages.slice(action.index + 1)
        ]
      };

    case 'SHOW_SNACKBAR':
      return {
        ...state,
        snackbar: {
          open: true,
          message: action.message
        }
      };

    case 'HIDE_SNACKBAR':
      return {
        ...state,
        snackbar: {
          open: false,
          message: ''
        }
      };

    default:
      return state;
  }
}

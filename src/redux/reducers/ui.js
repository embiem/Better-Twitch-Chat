const initialState = {
  channelName: '',
  messages: [],
  connectedTo: ''
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CHANNEL_NAME':
      return {
        ...state,
        channelName: action.channelName
      };

    case 'SET_CONNECTED_TO':
      return {
        ...state,
        connectedTo: action.channelName
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

    default:
      return state;
  }
}

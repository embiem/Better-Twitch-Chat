export const setMessageInput = message => ({
  type: 'SET_MESSAGE_INPUT',
  message
});

export const addMessage = messageObj => ({
  type: 'ADD_MESSAGE',
  messageObj
});

export const addHiddenMessage = messageObj => ({
  type: 'ADD_HIDDEN_MESSAGE',
  messageObj
});

export const removeMessage = index => ({
  type: 'REMOVE_MESSAGE',
  index
});

export const setCurrentChannel = channel => ({
  type: 'SET_CURRENT_CHANNEL',
  channel
});

export const showSnackbar = message => ({
  type: 'SHOW_SNACKBAR',
  message
});

export const hideSnackbar = () => ({
  type: 'HIDE_SNACKBAR'
});

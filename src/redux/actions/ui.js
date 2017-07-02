export const setMessageInput = message => ({
  type: 'SET_MESSAGE_INPUT',
  message
});

export const addMessage = messageObj => ({
  type: 'ADD_MESSAGE',
  messageObj
});

export const removeMessage = index => ({
  type: 'REMOVE_MESSAGE',
  index
});

export const showSnackbar = message => ({
  type: 'SHOW_SNACKBAR',
  message
});

export const hideSnackbar = () => ({
  type: 'HIDE_SNACKBAR'
});

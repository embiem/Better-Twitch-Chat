export const setSayMessage = message => ({
  type: 'SET_SAY_MESSAGE',
  message
});

export const addMessage = messageObj => ({
  type: 'ADD_MESSAGE',
  messageObj
});

export const showSnackbar = message => ({
  type: 'SHOW_SNACKBAR',
  message
});

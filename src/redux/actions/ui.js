export const setVotedMessages = messages => ({
  type: 'SET_VOTED_MESSAGES',
  messages
});

export const setVotedMessage = (key, val) => ({
  type: 'SET_VOTED_MESSAGE',
  key,
  val
});

export const updateVotedMessageLike = (key, liked) => ({
  type: 'UPDATE_VOTED_MESSAGE_LIKE',
  key,
  liked
});

export const removeVotedMessage = key => ({
  type: 'REMOVE_VOTED_MESSAGE',
  key
});

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

export const clearHiddenMessages = () => ({
  type: 'CLEAR_HIDDEN_MESSAGES'
});

export const removeMessage = index => ({
  type: 'REMOVE_MESSAGE',
  index
});

export const votedOnMessage = index => ({
  type: 'VOTED_ON_MESSAGE',
  index
});

export const votedOnHiddenMessage = index => ({
  type: 'VOTED_ON_HIDDEN_MESSAGE',
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

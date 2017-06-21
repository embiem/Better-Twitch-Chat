export const setChannelName = channelName => ({
  type: 'SET_CHANNEL_NAME',
  channelName
});

export const setSayMessage = message => ({
  type: 'SET_SAY_MESSAGE',
  message
});

export const setConnectedTo = channelName => ({
  type: 'SET_CONNECTED_TO',
  channelName
});

export const addMessage = messageObj => ({
  type: 'ADD_MESSAGE',
  messageObj
});

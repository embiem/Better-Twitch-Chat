export const setChannelName = channelName => ({
  type: 'SET_CHANNEL_NAME',
  channelName
});

export const setConnectedTo = channelName => ({
  type: 'SET_CONNECTED_TO',
  channelName
});

export const addMessage = messageObj => ({
  type: 'ADD_MESSAGE',
  messageObj
});

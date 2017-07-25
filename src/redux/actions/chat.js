import { uiActions } from './';

export const handleMessageReceived = (channel, user, message) => (dispatch, getState) => {
  console.log(message, channel, user);
  // TODO parse the message to extract emotes and apply ML model's prediction

  dispatch(uiActions.addMessage({ user, text: message, channel }));
};

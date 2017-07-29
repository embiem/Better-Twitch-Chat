import firebase from 'firebase';

import { uiActions } from './';
import NeuralNet from '../../api/NeuralNet';

export const handleTrainMessagesReceived = messagesObj => (
  dispatch,
  getState
) => {
  const { user } = getState();

  const messagesShow = [];
  const messagesHide = [];

  for (let key in messagesObj) {
    const msgObj = messagesObj[key];
    if (msgObj.liked && messagesShow.length < 300) {
      // for now we just limit the amount to prevent long NN-training
      messagesShow.push(msgObj.message);
    } else if (!msgObj.liked && messagesHide.length < 300) {
      // for now we just limit the amount to prevent long NN-trainin
      messagesHide.push(msgObj.message);
    }
  }
  const trainResult = NeuralNet.train(messagesShow, messagesHide);
  console.log('training finished: ', trainResult);
  dispatch(
    uiActions.showSnackbar(
      `NN trained after ${trainResult.iterations} iterations with an error of ${trainResult.error.toFixed(
        4
      )}!`
    )
  );

  // save the net
  const { netJSON, dictJSON } = NeuralNet.saveToJSON();
  firebase
    .database()
    .ref(`nets/${user.firebaseUser.uid}/`)
    .set({ netJSON, dictJSON, trainResult });
};

export const handleMessageReceived = (channel, user, message) => (
  dispatch,
  getState
) => {
  const prediction = NeuralNet.isTrained() ? NeuralNet.predict(message) : 1;
  if (prediction === 1) {
    dispatch(uiActions.addMessage({ user, text: message, channel }));
  } else {
    dispatch(uiActions.addHiddenMessage({ user, text: message, channel }));
  }
};

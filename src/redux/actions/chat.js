import { uiActions } from './';
import NeuralNet from '../../api/NeuralNet';

export const handleTrainMessagesReceived = messagesObj => () => {
  const messagesShow = [];
  const messagesHide = [];

  for (let key in messagesObj) {
    const msgObj = messagesObj[key];
    if (msgObj.liked && messagesShow.length < 100) { // for now we just limit the amount to prevent long NN-training
      messagesShow.push(msgObj.message);
    } else if (!msgObj.liked && messagesHide.length < 100) { // for now we just limit the amount to prevent long NN-trainin
      messagesHide.push(msgObj.message);
    }
    // TODO actually train the NN in a cloud function
    // a trained NN can be saved. Workflow:
    //    net.toJSON() -> stored in database
    // then it can be loaded by user:
    //    load from database -> net.fromJSON(loadedJson)
    // the cloud function should check be invoked by user to train the NN
  }
  //console.log(`training started with dataset of ${messagesShow.length + messagesHide.length}`, messagesShow, messagesHide);
  NeuralNet.train(messagesShow, messagesHide);
  console.log('training finished');
};

export const handleMessageReceived = (channel, user, message) => (
  dispatch,
  getState
) => {
  const prediction = NeuralNet.predict(message);
  if (prediction === 1) {
    dispatch(uiActions.addMessage({ user, text: message, channel }));
  } else {
    dispatch(uiActions.addHiddenMessage({ user, text: message, channel }));
  }
};

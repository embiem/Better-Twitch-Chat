import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';

import MessageDataset from './MessageDataset';
import Messages from '../chat/Messages';
import { uiActions, chatActions, userActions } from '../../redux/actions';
import NeuralNet from '../../api/NeuralNet';

class Train extends Component {
  constructor(props) {
    super(props);

    this.onRetrainModelClick = this.onRetrainModelClick.bind(this);
    this.checkForNN = this.checkForNN.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return false;
  }

  componentDidMount() {
    this.checkForNN();
  }

  checkForNN() {
    if (NeuralNet.isTrained()) {
      this.forceUpdate();
    } else {
      setTimeout(this.checkForNN, 1000);
    }
  }

  onRetrainModelClick() {
    const { dispatch, user } = this.props;

    if (!_.has(user, 'firebaseUser.uid')) {
      dispatch(uiActions.showSnackbar('Please log-in to train a model!'));
      return;
    }

    firebase
      .database()
      .ref(`messages/${user.firebaseUser.uid}/`)
      .once('value')
      .then(snapshot =>
        dispatch(chatActions.handleTrainMessagesReceived(snapshot.val()))
      );
  }

  render() {
    const { ui, user, votedMessages, dispatch } = this.props;
    const votedMessagesKeys = Object.keys(votedMessages);
    const isLoggedIn =
      user.firebaseUser && !user.firebaseUser.isAnonymous && user.twitchUser;

    return (
      <div className="container-center">
        <Card className="container">
          <CardTitle title="Train" subtitle="Neural Network Status" />
          <CardText>
            {NeuralNet.isTrained()
              ? <span style={{ fontSize: 'xx-large', color: 'green' }}>
                  READY
                </span>
              : <span style={{ fontSize: 'xx-large', color: 'red' }}>
                  UNTRAINED
                </span>}
          </CardText>
          <CardActions>
              <Checkbox
                label="Training Mode"
                checked={user.training}
                onCheck={() => {
                  if (isLoggedIn) {
                    dispatch(userActions.setTraining(!user.training));
                    this.forceUpdate();
                  } else {
                    dispatch(uiActions.showSnackbar('You need to be logged-in to train a NN!'));
                  }
                }}
              />
              <br/>
              <RaisedButton
                label="Retrain model (takes 5-20 seconds)"
                secondary={true}
                onTouchTap={this.onRetrainModelClick}
              />
          </CardActions>
        </Card>

        <Tabs>
          <Tab label="Hidden Messages">
            <Card className="container">
              <CardTitle
                title="Hidden Messages"
                subtitle="Vote up or down to further train your model"
              />
              <CardActions>
                <RaisedButton
                  label="Refresh"
                  primary={true}
                  onTouchTap={() => {
                    this.forceUpdate();
                  }}
                />
                <RaisedButton
                  label="Clear"
                  onTouchTap={() => {
                    dispatch(uiActions.clearHiddenMessages());
                    this.forceUpdate();
                  }}
                />
              </CardActions>
              <CardText>
                {ui.hiddenMessages.length <= 0
                  ? <p>No hidden messages available.</p>
                  : <Messages
                      hideVoted
                      messages={ui.hiddenMessages}
                      showVote={user.training}
                      onLikeMsg={(msg, idx) => {
                        // TODO add to votedMessages accordingly
                        dispatch(uiActions.votedOnHiddenMessage(idx));
                        firebase
                          .database()
                          .ref(`messages/${user.firebaseUser.uid}/`)
                          .push({
                            message: msg,
                            liked: true
                          })
                          .once('value')
                          .then(snapshot =>
                            dispatch(
                              uiActions.setVotedMessage(
                                snapshot.key,
                                snapshot.val()
                              )
                            )
                          );
                      }}
                      onDislikeMsg={(msg, idx) => {
                        // TODO add to votedMessages accordingly
                        dispatch(uiActions.votedOnHiddenMessage(idx));
                        firebase
                          .database()
                          .ref(`messages/${user.firebaseUser.uid}/`)
                          .push({
                            message: msg,
                            liked: false
                          })
                          .once('value')
                          .then(snapshot =>
                            dispatch(
                              uiActions.setVotedMessage(
                                snapshot.key,
                                snapshot.val()
                              )
                            )
                          );
                      }}
                    />}
              </CardText>
            </Card>
          </Tab>
          <Tab label="Dataset">
            <Card className="container">
              <CardTitle
                title="Voted Messages"
                subtitle="Change vote or remove from dataset"
              />
              <CardText>
                {votedMessagesKeys.length <= 0
                  ? <p>No voted messages available.</p>
                  : <MessageDataset
                      messages={votedMessages}
                      onToggleMessage={(key, toggleTo) => {
                        // toggle message in firebase & if successful in state
                        firebase
                          .database()
                          .ref(`messages/${user.firebaseUser.uid}/${key}/`)
                          .update({ liked: toggleTo })
                          .then(() => {
                            dispatch(
                              uiActions.updateVotedMessageLike(key, toggleTo)
                            );
                            this.forceUpdate();
                          })
                          .catch(err => console.error(err));
                      }}
                      onRemoveMessage={key => {
                        // remove message from firebase & if successful from state
                        firebase
                          .database()
                          .ref(`messages/${user.firebaseUser.uid}/${key}`)
                          .remove()
                          .then(() => {
                            dispatch(uiActions.removeVotedMessage(key));
                            this.forceUpdate();
                          })
                          .catch(err => console.error(err));
                      }}
                    />}
              </CardText>
            </Card>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user,
  votedMessages: state.votedMessages
}))(Train);

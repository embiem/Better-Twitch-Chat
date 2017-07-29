import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card';

import Message from '../chat/Message';
import { uiActions, chatActions } from '../../redux/actions';
import NeuralNet from '../../api/NeuralNet';

class Train extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = null;

    this.onRetrainModelClick = this.onRetrainModelClick.bind(this);
    this.checkForNN = this.checkForNN.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const { user } = this.props;
    if (!this.messagesRef && user.firebaseUser) {
      this.messagesRef = firebase
        .database()
        .ref(`messages/${user.firebaseUser.uid}/`);
    }
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

    firebase
      .database()
      .ref(`messages/${user.firebaseUser.uid}/`)
      .once('value')
      .then(snapshot =>
        dispatch(chatActions.handleTrainMessagesReceived(snapshot.val()))
      );
  }

  render() {
    const { ui, user, dispatch } = this.props;

    return (
      <div className="container-center">
        <Card className="container">
          <CardTitle title="Train" subtitle="Neural Network Status" />
          <CardText>
            {NeuralNet.isTrained()
              ? <span style={{ fontSize: 'xx-large', color: 'green' }}>READY</span>
              : <span style={{ fontSize: 'xx-large', color: 'red' }}>UNTRAINED</span>}
          </CardText>
          <CardActions>
            <RaisedButton
              label="Retrain model (takes 5-20 seconds)"
              fullWidth={true}
              secondary={true}
              onTouchTap={this.onRetrainModelClick}
            />
          </CardActions>
        </Card>

        <Card className="container">
          <CardTitle title="Hidden Messages" subtitle="Vote up or down to further train your model" />
          <CardActions>
            <RaisedButton
              label="Refresh"
              onTouchTap={() => {
                this.forceUpdate();
              }}
            />
          </CardActions>
          <CardText>
            <div className="Chat">
              {ui.hiddenMessages.length <= 0 ? <p>No hidden messages available.</p> : ui.hiddenMessages.map(
                (msg, idx) =>
                  msg.voted
                    ? ''
                    : <Message
                        key={msg.user['tmi-sent-ts'] + msg.user['user-id']}
                        message={msg.text}
                        user={msg.user}
                        channel={msg.channel}
                        onLikeMsg={msg => {
                          dispatch(uiActions.votedOnHiddenMessage(idx));
                          if (this.messagesRef)
                            this.messagesRef.push({ message: msg, liked: true });
                        }}
                        onDislikeMsg={msg => {
                          dispatch(uiActions.votedOnHiddenMessage(idx));
                          if (this.messagesRef)
                            this.messagesRef.push({ message: msg, liked: false });
                        }}
                      />
              )}
            </div>
          </CardText>
        </Card>
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(Train);

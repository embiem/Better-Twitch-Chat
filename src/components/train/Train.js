import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';

import Message from '../chat/Message';
import { uiActions } from '../../redux/actions';

class Train extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = null;
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
  }

  render() {
    const { ui, dispatch } = this.props;

    return (
      <div className="Chat">
          {ui.hiddenMessages
            .map((msg, idx) =>
              <Message
                key={msg.user['tmi-sent-ts'] + msg.user['user-id']}
                message={msg.text}
                user={msg.user}
                channel={msg.channel}
                onLikeMsg={msg => {
                  if (this.messagesRef)
                    this.messagesRef.push({ message: msg, liked: true });
                }}
                onDislikeMsg={msg => {
                  if (this.messagesRef)
                    this.messagesRef.push({ message: msg, liked: false });
                  dispatch(uiActions.removeMessage(idx));
                }}
              />
            )}
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(Train);

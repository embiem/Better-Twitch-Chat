import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Twitch from '../../api/Twitch';
import Message from './Message';
import { uiActions } from '../../redux/actions';

import './Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.twitch = null;
    this.messagesRef = null;
  }

  componentDidMount() {
    const { dispatch } = this.props;

    this.twitch = new Twitch(this.props.match.params.channel);
    this.twitch.client.on('message', (channel, userstate, message, self) => {
      dispatch(
        uiActions.addMessage({ user: userstate, text: message, channel })
      );
    });
  }

  componentDidUpdate() {
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
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={400}
          transitionLeaveTimeout={300}
        >
          {ui.messages.map((msg, idx) =>
            <Message
              key={idx}
              message={msg.text}
              user={msg.user}
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
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(Chat);

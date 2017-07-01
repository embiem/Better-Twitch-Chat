import React, { Component } from 'react';
import { connect } from 'react-redux';

import Twitch from '../../api/Twitch';

import Message from './Message';

import { uiActions } from '../../redux/actions';

import './Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.twitch = null;
  }

  componentDidMount() {
    const {dispatch} = this.props;

    this.twitch = new Twitch(this.props.match.params.channel);
    this.twitch.client.on('message', (channel, userstate, message, self) => {
      console.log(message, userstate);
      dispatch(
        uiActions.addMessage({ user: userstate, text: message, channel })
      );
    });
  }

  render() {
    const { ui } = this.props;
    return (
      <div className="Chat">
        {ui.messages.map((msg, idx) =>
          <Message message={msg.text} user={msg.user} key={idx}/>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui
}))(Chat);

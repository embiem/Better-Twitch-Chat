import React, { Component } from 'react';
import { connect } from 'react-redux';

import Twitch from '../../api/Twitch';

import Username from './Username';

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
    return (
      <div className="Chat">
        {`We're at ${this.props.match.params.channel}, right?`}
      </div>
    );
  }
}

export default connect(state => ({
  overlays: state.overlays
}))(Chat);

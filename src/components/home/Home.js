import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ConnectForm from '../forms/Connect';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { channelToJoin: '', joinChannel: false };
  }

  render() {
    if (!this.state.joinChannel) {
      return (
        <ConnectForm
          onChannelNameChanged={(event, newVal) =>
            this.setState({ ...this.state, channelToJoin: newVal })}
          onConnectClicked={() =>
            this.setState({ ...this.state, joinChannel: true })}
        />
      );
    } else {
      return <Redirect to={`/chat/${this.state.channelToJoin}`} />;
    }
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(Home);

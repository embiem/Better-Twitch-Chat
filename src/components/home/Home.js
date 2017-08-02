import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import {Card, CardTitle, CardText} from 'material-ui/Card';

import ConnectForm from '../forms/Connect';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { channelToJoin: '', joinChannel: false };
  }

  render() {
    if (!this.state.joinChannel) {
      return (
        <div className="container-center">
          <Card className="container">
            <CardTitle title="Welcome!" subtitle="About this WebApp" />
            <CardText>
              <b>Just join a Twitch-Channel with the form below & enjoy!</b>
            </CardText>
            <CardText>
              This WebApp uses Machine Learning to filter messages in Twitch-Chat.
              We have a default global model, but you can train your own{' '}
              <a href="https://en.wikipedia.org/wiki/Artificial_neural_network" target="_blank">
                ANN
              </a>{' '}
              model if you login via Twitch.
            </CardText>
            <CardText>
              After logging in, go to the <Link to="/train">Train</Link> page and activate
              training mode. Then join your favorite Twitch channel & vote on some
              messages, go back to the Train page and train your model!
            </CardText>
          </Card>
          <ConnectForm
            onChannelNameChanged={(event, newVal) =>
              this.setState({ ...this.state, channelToJoin: newVal })}
            onConnectClicked={() =>
              this.setState({ ...this.state, joinChannel: true })}
          />
        </div>
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

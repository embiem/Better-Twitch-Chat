import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconMessage from 'material-ui/svg-icons/communication/message';
import Popover from 'material-ui/Popover';

import Twitch from '../../api/Twitch';
import Message from './Message';
import MessagesContainer from './MessagesContainer';
import { uiActions } from '../../redux/actions';

import './Chat.css';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.twitch = null;
    this.messagesRef = null;

    this.state = {
      open: false
    };
  }

  _connectToTwitch(identity) {
    const { dispatch } = this.props;

    if (this.twitch) {
      this.twitch.client.disconnect();
    }
    this.twitch = new Twitch(this.props.match.params.channel, identity);
    this.twitch.client.on('message', (channel, userstate, message, self) => {
      // TODO parse the message to extract emotes and apply ML model's prediction
      dispatch(
        uiActions.addMessage({ user: userstate, text: message, channel })
      );
    });
  }

  componentDidMount() {
    this._connectToTwitch();
  }

  componentDidUpdate() {
    const { user } = this.props;
    if (!this.messagesRef && user.firebaseUser) {
      this.messagesRef = firebase
        .database()
        .ref(`messages/${user.firebaseUser.uid}/`);
    }
    if (
      (!this.twitch || !this.twitch.client.getOptions().identity.password) &&
      user.twitchToken &&
      user.twitchUser
    ) {
      this._connectToTwitch({
        username: user.twitchUser.name,
        password: user.twitchToken
      });
    }
  }

  showSendMessageInterface = event => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      ...this.state,
      open: true,
      anchorEl: event.currentTarget
    });
  };

  handleRequestClose = () => {
    this.setState({
      ...this.state,
      open: false
    });
  };

  sendMessage = () => {
    const { dispatch, ui } = this.props;
    if (ui.messageInput) {
      dispatch(uiActions.setMessageInput(''));
      this.twitch.client.say(
        `${this.props.match.params.channel}`,
        ui.messageInput
      );
    }
  };

  _renderMessageInterface() {
    const { user, ui, dispatch } = this.props;
    const isLoggedIn =
      user.firebaseUser && !user.firebaseUser.isAnonymous && user.twitchUser;

    return (
      <div>
        <FloatingActionButton
          onTouchTap={this.showSendMessageInterface}
          disabled={!isLoggedIn}
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            zIndex: '9999'
          }}
        >
          <IconMessage />
        </FloatingActionButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
          style={{ width: '300px', height: '200px', padding: '1rem' }}
        >
          <TextField
            className="Message-Input"
            disabled={!isLoggedIn}
            hintText="Kappa"
            floatingLabelText="Send Chat-Message"
            onChange={(event, newVal) =>
              dispatch(uiActions.setMessageInput(newVal))}
            value={ui.messageInput}
            onKeyPress={event => {
              if (event.charCode === 13) {
                event.preventDefault();
                this.sendMessage();
              }
            }}
          />
          <RaisedButton
            label="Send"
            fullWidth={true}
            primary={true}
            disabled={!isLoggedIn || !ui.messageInput}
            onTouchTap={this.sendMessage}
          />
        </Popover>
      </div>
    );
  }

  render() {
    const { ui, dispatch } = this.props;

    return (
      <div className="Chat">
        <ReactCSSTransitionGroup
          component={MessagesContainer}
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
        {this._renderMessageInterface()}
      </div>
    );
  }
}

export default connect(state => ({
  ui: state.ui,
  user: state.user
}))(Chat);

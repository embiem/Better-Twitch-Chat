import React from 'react';
import IconButton from 'material-ui/IconButton';
import Username from './Username';

import './Message.css';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }
  render() {
    return (
      <div className="Chat-Message">
        <Username channel={this.props.channel} user={this.props.user} />
        <div className="Message">{this.props.message}</div>
        {this.state.liked
          ? <div className="Annotation">
              {`Thanks for liking!`}
            </div>
          : <div className="Vote">
              <IconButton
                style={{padding: '2px', height: '40px', width: '40px'}}
                iconClassName="fa fa-thumbs-o-up"
                onTouchTap={() => {
                  this.props.onLikeMsg(this.props.message);
                  this.setState({ liked: true });
                }}
              />
              <IconButton
                style={{padding: '2px', height: '40px', width: '40px'}}
                iconClassName="fa fa-thumbs-o-down"
                onTouchTap={() => {
                  this.props.onDislikeMsg(this.props.message);
                }}
              />
            </div>}
      </div>
    );
  }
}

export default Message;

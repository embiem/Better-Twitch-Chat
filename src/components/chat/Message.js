import React from 'react';
import IconButton from 'material-ui/IconButton';
import Username from './Username';

import './Message.css';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this._renderMessage = this._renderMessage.bind(this);
    this.state = { voted: false };
  }

  _renderMessage() {
    const emotes = this.props.user.emotes;
    let msgArray = this.props.message.split("");
    const parsedMsg = [];
    for (let emoteIndex in emotes) {
      const emote = emotes[emoteIndex];

      for (let charIndices in emote) {
        let emoteIndices = emote[charIndices];

        if (typeof emoteIndices == 'string') {
          emoteIndices = emoteIndices.split('-');
          emoteIndices = [parseInt(emoteIndices[0]), parseInt(emoteIndices[1])];
          // push text to next emoteIndex
          // parsedMsg[emoteIndices[0]] = msgArray.slice(lastIndex, emoteIndices[0]).join("");
          parsedMsg[emoteIndices[0] + 1] = {emote: `http://static-cdn.jtvnw.net/emoticons/v1/${emoteIndex}/3.0`};
          for (let i = emoteIndices[0]; i <= emoteIndices[1]; i++) {
            msgArray[i] = null;
          }
        }
      }
    }

    let coherentString = '';
    let lastCharIndex = 0;
    for (let i = 0; i < msgArray.length; i++) {
      const char = msgArray[i];
      if (char) {
        coherentString += char;
        lastCharIndex = i;
      } else if (coherentString) {
        parsedMsg[i] = coherentString;
        coherentString = '';
      }
    }
    if (coherentString) {
      parsedMsg[msgArray.length] = coherentString;
    }

    return parsedMsg.map((entry, idx) => {
      if (typeof entry === 'object') {
        // emote
        return <img key={idx} className="emoticon" src={entry.emote} alt="Emote" />;
      } else if (typeof entry === 'string') {
        return <span key={idx}>{entry}</span>
      }
    });
  }

  render() {
    return (
      <div className="Chat-Message">
        <Username channel={this.props.channel} user={this.props.user} />
        <div className="Message">{this._renderMessage()}</div>
        {this.state.voted || this.props.message.voted
          ? <div className="Annotation">
              {`Thanks for voting!`}
            </div>
          : <div className="Vote">
              <IconButton
                style={{ padding: '2px', height: '40px', width: '40px' }}
                iconClassName="fa fa-thumbs-o-up"
                onTouchTap={() => {
                  this.props.onLikeMsg(this.props.message);
                  this.setState({ voted: true });
                }}
              />
              <IconButton
                style={{ padding: '2px', height: '40px', width: '40px' }}
                iconClassName="fa fa-thumbs-o-down"
                onTouchTap={() => {
                  this.props.onDislikeMsg(this.props.message);
                  this.setState({ voted: true });
                }}
              />
            </div>}
      </div>
    );
  }
}

export default Message;

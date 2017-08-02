import React from 'react';
import Message from './Message';

const Messages = props => {
  return (
    <div className="Messages">
      {props.messages.map(
        (msg, idx) =>
          props.hideVoted && msg.voted
            ? ''
            : <Message
                showVote={props.showVote}
                key={msg.user['tmi-sent-ts'] + msg.user['user-id']}
                message={msg.text}
                user={msg.user}
                channel={msg.channel}
                onLikeMsg={msg => props.onLikeMsg(msg, idx)}
                onDislikeMsg={msg => props.onDislikeMsg(msg, idx)}
              />
      )}
    </div>
  );
};

export default Messages;

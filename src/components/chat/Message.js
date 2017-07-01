import React from 'react';
import Username from './Username';

const Message = props => {
  return (
    <div className="Chat-Message">
      <Username channel={props.channel} user={props.user} />
      <div className="Message">{props.message}</div>
    </div>
  );
};

export default Message;

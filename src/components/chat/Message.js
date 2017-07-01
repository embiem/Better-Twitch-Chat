import React from 'react';
import IconButton from 'material-ui/IconButton';
import Username from './Username';

const Message = props => {
  return (
    <div className="Chat-Message">
      <Username channel={props.channel} user={props.user} />
      <div className="Message">{props.message}</div>
      <div className="Vote">
        <IconButton
          iconClassName="fa fa-thumbs-o-up"
          onTouchTap={() => console.log(`Liked '${props.message}'`)}
        />
        <IconButton
          iconClassName="fa fa-thumbs-o-down"
          onTouchTap={() => console.log(`Disliked '${props.message}'`)}
        />
      </div>
    </div>
  );
};

export default Message;

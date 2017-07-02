import React from 'react';

const MessagesContainer = props => {
  return (
    <div className="Message-List">
      {props.children}
    </div>
  );
};

export default MessagesContainer;

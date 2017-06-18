import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const Connect = (props) => (
  <div>
    <TextField
      hintText="Jonsandman"
      floatingLabelText="Channel-Name"
      onChange={props.onChannelNameChanged}
    />
    <FlatButton label="Connect" onTouchTap={props.onConnectClicked} />
  </div>
);

export default Connect;

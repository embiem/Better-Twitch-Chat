import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';

const Connect = props =>
  <Card className="container">
    <CardTitle title="Connect to a Twitch-Channel" />
    <CardText>
      <TextField
        hintText="Jonsandman"
        floatingLabelText="Channel-Name"
        onChange={props.onChannelNameChanged}
      />
    </CardText>
    <CardActions>
      <FlatButton label="Connect" primary onTouchTap={props.onConnectClicked} />
    </CardActions>
  </Card>;

export default Connect;

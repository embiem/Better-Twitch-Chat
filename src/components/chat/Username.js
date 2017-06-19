import React from 'react';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import { green500, red900, grey200, grey800 } from 'material-ui/styles/colors';

export default class Username extends React.Component {
  static styles = {
    chip: {
      margin: 4
    },
    wrapper: {
      display: 'flex',
      flexWrap: 'wrap'
    }
  };

  state = {
    hover: false
  };

  constructor(props) {
    super(props);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
  }

  mouseOver() {
    this.setState({ hover: true });
  }

  mouseOut() {
    this.setState({ hover: false });
  }

  render() {
    const { userstate, channel } = this.props;

    let bgColor = grey200;
    if (userstate.username === channel) bgColor = red900;
    else if (userstate.mod) bgColor = green500;

    return (
      <div onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
        <Chip
          backgroundColor={bgColor}
          onTouchTap={() => {
            console.log(
              `TODO: Chat-Message username ${userstate.username} was clicked!`
            );
          }}
          style={Username.styles.chip}
        >
          <Avatar
            size={32}
            color={(() => (userstate.color ? userstate.color : grey800))()}
            backgroundColor={bgColor}
          >
            {userstate.username.substr(0, 2).toUpperCase()}
          </Avatar>
          {(() => {
            if (this.state.hover) {
              return userstate['display-name']
                ? userstate['display-name']
                : userstate.username;
            }
          })()}
        </Chip>
      </div>
    );
  }
}

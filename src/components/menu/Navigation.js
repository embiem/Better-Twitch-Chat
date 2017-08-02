import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SVGNavMenu from 'material-ui/svg-icons/navigation/menu';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';

const Navigation = props => {
  const RightArea = !props.userData
    ? <FlatButton
        label="Login"
        secondary={true}
        icon={<FontIcon className="fa fa-twitch" />}
      />
    : <ListItem
        disabled={false}
        leftAvatar={
          <Avatar src={props.userData.image}  />
        }
      >
        {props.userData.name}
      </ListItem>;

  return (
    <AppBar
      title={props.title}
      onLeftIconButtonTouchTap={props.onLeftIconClicked}
      onRightIconButtonTouchTap={props.onRightIconClicked}
      iconElementLeft={<IconButton><SVGNavMenu /></IconButton>}
      iconElementRight={RightArea}
    />
  );
};

export default Navigation;

import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SVGNavMenu from 'material-ui/svg-icons/navigation/menu';

const Navigation = props => {
  return (
    <AppBar
      title={props.title}
      onLeftIconButtonTouchTap={props.onLeftIconClicked}
      onRightIconButtonTouchTap={props.onRightIconClicked}
      iconElementLeft={<IconButton><SVGNavMenu /></IconButton>}
    />
  );
};

export default Navigation;

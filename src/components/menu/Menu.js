import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SVGNavClose from 'material-ui/svg-icons/navigation/close';

class Menu extends Component {
  constructor(props) {
      super(props);
      this.renderMenuItems = this.renderMenuItems.bind(this);
    }
    renderMenuItems() {
      if (this.props.entries) {
        return this.props.entries.map((entry) => {
          return (
            <MenuItem key={entry.id} onTouchTap={() => this.props.onEntryClicked(entry.id)}>
              {entry.name}
            </MenuItem>
          );
        });
      }
      return <MenuItem>Nothing to show here!</MenuItem>;
    }

    render() {
      return (
        <Drawer open={this.props.open}>
          <AppBar
            title={this.props.title}
            iconElementLeft={<IconButton><SVGNavClose /></IconButton>}
            onLeftIconButtonTouchTap={this.props.onCloseClicked} />
          {this.renderMenuItems()}
        </Drawer>
      );
    }
}

export default Menu;

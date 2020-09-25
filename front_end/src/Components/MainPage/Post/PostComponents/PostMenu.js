import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//component contains menu related post options
export default class PostMenu extends Component {
  render() {
    return (
      <Menu
        id="simple-menu"
        anchorEl={this.props.anchorEl}
        keepMounted
        open={Boolean(this.props.anchorEl)}
        onClose={this.props.ClosePostMenu}
      >
        <MenuItem onClick={() => this.props.HandlePostMenClick("Edit")}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => this.props.HandlePostMenClick("Delete")}>
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => this.props.HandlePostMenClick("DisableComments")}
        >
          {this.props.DisableAddComments === true
            ? "Enable Comments"
            : "Disable Comments"}
        </MenuItem>
        <MenuItem
          onClick={() => this.props.HandlePostMenClick("DisableSharing")}
        >
          {this.props.DisableSharing === true
            ? "Enable Sharing"
            : "Disable Sharing"}
        </MenuItem>
      </Menu>
    );
  }
}

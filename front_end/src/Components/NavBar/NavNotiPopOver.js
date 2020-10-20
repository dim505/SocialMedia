import React, { Component } from "react";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import PeopleIcon from "@material-ui/icons/People";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
  Redirect
} from "react-router-dom";
import { ApiCall } from "../SharedComponents/ApiCall";
import NotificationActivity from "./NotificationActivity"
 
export default class NavNotiPopOver extends Component {
  state = {
		Messages: []
  };

 
 componentDidMount = () => {
   
	     ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/home/GetNotifications`
    ).then((results) => {
      this.setState({
        Messages: results,
      });
    });
 }


  render() {
    return (
                <Popover
                  classes={{
                    paper: "NavNotiPopOver",
                  }}
                  onClose={this.props.CloseNotiPopOver}
                  open={Boolean(this.props.PopOverNotiAnchorEl)}
                  anchorEl={this.props.PopOverNotiAnchorEl}
                >
               
                  <div className="NotiContentActivity">
                    {
						this.state.Messages.length > 0 ? 						
						this.state.Messages.map((message) => (
                      <NotificationActivity message={message} />
                    )) : <div className="NotiContentNoActivity">All Caught Up! </div> 
					
					
					}
                  </div>
                </Popover>
    );
  }
  s;
}

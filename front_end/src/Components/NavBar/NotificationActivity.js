import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Fade from "react-reveal/Fade";
import { ApiCall } from "../SharedComponents/ApiCall";

export default class NotificationActivity extends Component {
  state = {
    ShowNoti: true,
  };
  RemoveNoti = () => {
    this.setState({
      ShowNoti: false,
    });

    
    ApiCall(
      "Delete",
      `${process.env.REACT_APP_BackEndUrl}/api/Home/DeleteNotification/${this.props.message.FollowerAuth0ID}/${this.props.message.FollowingAuth0ID}`
      
    ).then(() => {
		this.props.GetNotifications()
		console.log("deleted")
    });

    
  };

  render() {
    return (
      <Fade bottom opposite collapse when={this.state.ShowNoti}>
        <Paper>
          <List>
            <ListItem>
              <ListItemIcon>
                <Avatar />
              </ListItemIcon>

              <ListItemText primary={this.props.message.Message} />
              <IconButton onClick={() => this.RemoveNoti()}>
                <HighlightOffIcon />
              </IconButton>
            </ListItem>
          </List>
        </Paper>
      </Fade>
    );
  }
}

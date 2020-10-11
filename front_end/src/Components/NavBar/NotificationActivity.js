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
//import { ApiCall } from "./ApiCall";

export default class NotificationActivity extends Component {
  state = {
    ShowNoti: true,
  };
  RemoveNoti = () => {
    this.setState({
      ShowNoti: false,
    });

    /*
    var MyData = {};
    MyData.UpdatePostData = {
      PostGuid: this.props.post.postGuid,
      DisableSharing: !this.state.DisableSharing,
    };

    ApiCall(
      "Post",
      `${process.env.REACT_APP_BackEndUrl}/api/people/UpdateNotification`,
      MyData
    ).then(() => {
      this.setState({
        ShowNoti: false
      });
    });

    */
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

              <ListItemText primary={this.props.message.message} />
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

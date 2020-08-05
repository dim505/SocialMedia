import React, { Component } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditPostComment from "./EditPostComment";

export default class PostComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AddComment: false,
      OpnModal: false,
      anchorEl: false,
      DisableSharing: false,
      ShowEdit: false
    };
  }

  OpnPostMenu = event => {
    debugger;
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  ClosePostMenu = () => {
    this.setState({
      anchorEl: null
    });
  };

  CloseEditComment = NotiMessage => {
    this.setState({
      ShowEdit: false
    });
    if (NotiMessage !== undefined) {
      this.props.OpenNoti(NotiMessage);
    }
  };

  HandlePostMenClick = ButtonClicked => {
    console.log(ButtonClicked);
    if (ButtonClicked === "Edit") {
      this.setState({
        ShowEdit: true
      });
    } else if (ButtonClicked === "Delete") {
      this.props.OpenNoti("Post Deleted");
    }

    this.ClosePostMenu();
  };

  render() {
    return (
      <div>
        <CardHeader
          avatar={<Avatar>R</Avatar>}
          action={
            <div>
              <IconButton
                onClick={e => this.OpnPostMenu(e)}
                aria-label="settings"
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          }
          classes={{
            root: "TextAllignLeft",
            title: "PostCommentTitle",
            subheader: "PostCommentSubheader"
          }}
          title={this.state.ShowEdit === false ? "BIB BOB | 6 days ago" : ""}
          subheader={
            this.state.ShowEdit === false ? (
              "This is a POST "
            ) : (
              <EditPostComment
                ShowEdit={this.state.ShowEdit}
                CloseEditComment={this.CloseEditComment}
              />
            )
          }
        />

        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.ClosePostMenu}
        >
          <MenuItem
            classes={{
              root: "PostCommentActionButton"
            }}
            onClick={() => this.HandlePostMenClick("Edit")}
          >
            Edit
          </MenuItem>
          <MenuItem
            classes={{
              root: "PostCommentActionButton"
            }}
            onClick={() => this.HandlePostMenClick("Delete")}
          >
            Delete
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

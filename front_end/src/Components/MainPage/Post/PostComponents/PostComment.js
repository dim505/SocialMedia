import React, { Component } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import EditPostComment from "./EditPostComment";
import { ApiCall } from "../../../SharedComponents/ApiCall";
import Context from "../../../SharedComponents/context";

//component contains the comment portion of the post
export default class PostComment extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      AddComment: false,
      OpnModal: false,
      anchorEl: false,
      DisableSharing: false,
      ShowEdit: false,
      Comments: [],
    };
  }

  //open menu with options pertaining to comment
  OpnPostMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  //closes menu with options pertaining to comment
  ClosePostMenu = () => {
    this.setState({
      anchorEl: null,
    });
  };

  //closes edit comment component
  CloseEditComment = () => {
    this.setState({
      ShowEdit: false,
    });
  };

  //handles comment menu button click
  HandlePostMenClick = (ButtonClicked) => {
    console.log(ButtonClicked);
    if (ButtonClicked === "Edit") {
      this.setState({
        ShowEdit: true,
      });
    } else if (ButtonClicked === "Delete") {
      ApiCall(
        "Delete",
        `${process.env.REACT_APP_BackEndUrl}/api/home/DeleteComment/${this.props.comment.commentGuid}`
      ).then((results) => {
        this.props.GetComments();
        this.context.OpenNoti("Comment Deleted");
      });
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
                onClick={(e) => this.OpnPostMenu(e)}
                aria-label="settings"
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          }
          classes={{
            root: "TextAllignLeft",
            title: "PostCommentTitle",
            subheader: "PostCommentSubheader",
          }}
          title={this.state.ShowEdit === false ? "BIB BOB | 6 days ago" : ""}
          subheader={
            this.state.ShowEdit === false ? (
              this.props.comment.commentContent
            ) : (
              <EditPostComment
                comment={
                  this.props.comment /*insert props for comment content here */
                }
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
              root: "PostCommentActionButton",
            }}
            onClick={() => this.HandlePostMenClick("Edit")}
          >
            Edit
          </MenuItem>
          <MenuItem
            classes={{
              root: "PostCommentActionButton",
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

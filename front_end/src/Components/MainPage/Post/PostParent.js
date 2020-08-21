import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import SharedModal from "../../SharedComponents/SharedModal";
import SharePost from "./PostComponents/SharePost";
import PostComment from "./PostComponents/PostComment";
import AddPostModal from "../AddPostModal";
import AddPostComment from "./PostComponents/AddPostComment";
import PostMenu from "./PostComponents/PostMenu";
import Post from "./PostComponents/Post";
import SnackBar from "../../SharedComponents/SnackBar";

export default class PostParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AddComment: false,
      OpnModal: false,
      anchorEl: false,
      DisableSharing: false,
      DisableAddComments: false,
      PostFavorited: false,
      NumberOfFav: 10,
    };
  }

  handleClickAway = () => {
    console.log("nein nein nein");
    this.setState({
      anchorEl: null,
    });
  };

  //function opens payment portal modal
  OpnModal = (ModalToOpen) => {
    this.setState({
      OpnModal: true,
      ModalToOpen: ModalToOpen,
    });
  };

  CloseModal = () => {
    this.setState({
      OpnModal: false,
    });
  };

  OpnPostMenu = (event) => {
    debugger;
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  ClosePostMenu = () => {
    this.setState({
      anchorEl: null,
    });
  };

  //function open alert notification
  OpenNoti = (message) => {
    this.setState({
      OpenNoti: true,
      Message: message,
    });
  };
  //function closes alert notification
  CloseNoti = () => {
    this.setState({
      OpenNoti: false,
    });
  };

  HandleFavoritePost = () => {
    this.setState({
      PostFavorited: !this.state.PostFavorited,
    });
  };

  HandlePostMenClick = (ButtonClicked) => {
    console.log(ButtonClicked);
    if (ButtonClicked === "DisableSharing") {
      this.setState({
        DisableSharing: !this.state.DisableSharing,
      });
    } else if (ButtonClicked === "DisableComments") {
      this.setState({
        DisableAddComments: !this.state.DisableAddComments,
      });
    } else if (ButtonClicked === "Edit") {
      this.OpnModal("EditModal");
    } else if (ButtonClicked === "Delete") {
      this.OpenNoti("Post Deleted");
    }

    this.ClosePostMenu();
  };

  HandleAddCommentClick = () => {
    this.setState({
      AddComment: !this.state.AddComment,
    });
  };

  RenderModalComp = () => {
    if (this.state.ModalToOpen === "EditModal") {
      return (
        <div className="AddPostModal ">
          <AddPostModal CloseModal={this.CloseModal} />
        </div>
      );
    } else {
      return (
        <div className="ShareIconModal">
          <SharePost />
        </div>
      );
    }
  };
  render() {
    return (
      <Card>
        <Post
          PostFavorited={this.state.PostFavorited}
          NumberOfFav={this.state.NumberOfFav}
          AddComment={this.state.AddComment}
          OpnPostMenu={this.OpnPostMenu}
          HandleFavoritePost={this.HandleFavoritePost}
          OpnModal={this.OpnModal}
          DisableSharing={this.state.DisableSharing}
          DisableAddComments={this.state.DisableAddComments}
          HandleAddCommentClick={this.HandleAddCommentClick}
        />
        <Collapse in={this.state.AddComment} timeout="auto" unmountOnExit>
          <Divider />

          <PostComment OpenNoti={this.OpenNoti} />

          <Divider />

          {this.state.DisableAddComments === true ? (
            <div> </div>
          ) : (
            <AddPostComment />
          )}
        </Collapse>

        <SharedModal
          OpnModal={this.state.OpnModal}
          CloseModal={this.CloseModal}
        >
          {this.RenderModalComp()}
        </SharedModal>

        <PostMenu
          anchorEl={this.state.anchorEl}
          DisableSharing={this.state.DisableSharing}
          HandlePostMenClick={this.HandlePostMenClick}
          DisableAddComments={this.state.DisableAddComments}
          ClosePostMenu={this.ClosePostMenu}
        />

        <SnackBar
          OpenNoti={this.state.OpenNoti}
          CloseNoti={this.CloseNoti}
          message={this.state.Message}
        />
      </Card>
    );
  }
}

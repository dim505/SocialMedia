import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import SharedModal from "../../SharedComponents/SharedModal";
import SharePost from "./PostComponents/SharePost";
import PostComment from "./PostComponents/PostComment";
import PostModal from "../PostModal";
import AddPostComment from "./PostComponents/AddPostComment";
import PostMenu from "./PostComponents/PostMenu";
import Post from "./PostComponents/Post";
import Context from "../../SharedComponents/context";
import { ApiCall } from "../../SharedComponents/ApiCall";
import "./Post.css";
//this houses the all components related to the post component
export default class PostParent extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      ShowComment: false,
      anchorEl: false,
      DisableSharing: 123,
      DisableAddComments: 123,
      PostFavorited: false,
      NumberOfFav: 10,
      Comments: [],
    };
  }

  componentDidMount = async () => {
 

    if (
      this.state.DisableSharing === 123 ||
      this.state.DisableAddComments === 123
    ) {
      this.setState({
        DisableSharing: this.props.post.disableSharing,
        DisableAddComments: this.props.post.disableComments,
      });
    }
  };

  componentDidUpdate(prevProps) {
 

    if (
      this.state.DisableSharing === 123 ||
      this.state.DisableAddComments === 123
    ) {
      this.setState({
        DisableSharing: this.props.post.disableSharing,
        DisableAddComments: this.props.post.disableComments,
      });
    }
  }

  //hides menu if user clicks away
  handleClickAway = () => {
    this.setState({
      anchorEl: null,
    });
  };

  //function opens modal
  OpnModal = (ModalToOpen) => {
    this.setState({
      OpnModal: true,
      ModalToOpen: ModalToOpen,
    });
  };

  //closes any modal related to this component
  CloseModal = () => {
    this.setState({
      OpnModal: false,
    });
  };

  //open menu containing options related to the post
  OpnPostMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };
  //closes menu containing options related to the post
  ClosePostMenu = () => {
    this.setState({
      anchorEl: null,
    });
  };

  GetComments = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/home/GetComments/${this.props.post.postGuid}`
    ).then((results) => {
      this.setState({
        Comments: results,
      });
    });
  };

  //tracks that the user liked a post or not
  HandleFavoritePost = async () => {
    if (this.props.post.didUserLikePost !== "yes") {
      var MyData = {};
      MyData.AddLikedComment = {
        PostGuid: this.props.post.postGuid,
        PostContent: this.state.Post,
      };
      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/home/LikeComment`,
        MyData
      ).then(() => {
        setTimeout(async () => {
          await this.context.GetLikedPosts();
          await this.context.GetMainPagePosts();
          await this.context.GetProfilePagePosts();
          await this.setState({
            PostFavorited: true,
          });
        }, 500);
      });
    } else {
      ApiCall(
        "Delete",
        `${process.env.REACT_APP_BackEndUrl}/api/home/DeleteLikedPost/${this.props.post.postGuid}`
      ).then((results) => {
        setTimeout(async () => {
          await this.context.GetLikedPosts();
          await this.context.GetMainPagePosts();
          await this.context.GetProfilePagePosts();
          await this.setState({
            PostFavorited: false,
          });
        }, 500);
      });
    }
  };

  //this function handles various clicks the related to the post menu
  HandlePostMenClick = (ButtonClicked) => {
    if (ButtonClicked === "DisableSharing") {
      var MyData = {};
      MyData.UpdatePostData = {
        PostGuid: this.props.post.postGuid,
        DisableSharing: !this.state.DisableSharing,
      };
      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/home/UpdatePost/DisableSharing`,
        MyData
      ).then(() => {
        this.setState({
          DisableSharing: !this.state.DisableSharing,
        });
        this.context.GetMainPagePosts();
        this.context.GetProfilePagePosts();
      });
    } else if (ButtonClicked === "DisableComments") {
      var MyData = {};
      MyData.UpdatePostData = {
        PostGuid: this.props.post.postGuid,
        DisableComments: !this.state.DisableAddComments,
      };
      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/home/UpdatePost/DisableComments`,
        MyData
      ).then(() => {
        this.setState({
          DisableAddComments: !this.state.DisableAddComments,
        });
        this.context.GetMainPagePosts();
        this.context.GetProfilePagePosts();
      });
    } else if (ButtonClicked === "Edit") {
      this.OpnModal("EditModal");
    } else if (ButtonClicked === "Delete") {
      ApiCall(
        "Delete",
        `${process.env.REACT_APP_BackEndUrl}/api/home/DeletePost/${this.props.post.postGuid}`
      ).then((results) => {
        this.context.OpenNoti("Post Deleted");
        this.context.GetMainPagePosts();
        this.context.GetProfilePagePosts();
      });
    }

    this.ClosePostMenu();
  };

  //this displays the comments the post
  HandleAddCommentClick = () => {
    this.GetComments();
    this.setState({
      ShowComment: !this.state.ShowComment,
    });
  };

  //this function renders the appropriate modal
  RenderModalComp = () => {
    if (this.state.ModalToOpen === "EditModal") {
      return (
        <div className="PostModal ">
          <PostModal
            post={this.props.post}
            ModalType="Edit"
            CloseModal={this.CloseModal}
          />
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
          state={this.state}
          OpnPostMenu={this.OpnPostMenu}
          HandleFavoritePost={this.HandleFavoritePost}
          OpnModal={this.OpnModal}
          HandleAddCommentClick={this.HandleAddCommentClick}
          post={this.props.post}
        />
        <Collapse in={this.state.ShowComment} timeout="auto" unmountOnExit>
          <Divider />

          {this.state.Comments.length > 0 ? (
            this.state.Comments.map((comment) => (
              <PostComment
                GetComments={this.GetComments}
                comment={comment}
                OpenNoti={this.OpenNoti}
              />
            ))
          ) : (
            <h3>Sorry No Comments found</h3>
          )}
          <Divider />

          {this.state.DisableAddComments === true ? (
            <div> </div>
          ) : (
            <AddPostComment
              HandleAddCommentClick={this.HandleAddCommentClick}
              post={this.props.post}
            />
          )}
        </Collapse>

        <SharedModal
          OpnModal={this.state.OpnModal}
          CloseModal={this.CloseModal}
        >
          {this.RenderModalComp()}
        </SharedModal>

        <PostMenu
          post={this.props.post}
          anchorEl={this.state.anchorEl}
          DisableSharing={this.state.DisableSharing}
          HandlePostMenClick={this.HandlePostMenClick}
          DisableAddComments={this.state.DisableAddComments}
          ClosePostMenu={this.ClosePostMenu}
        />
      </Card>
    );
  }
}

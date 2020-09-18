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

//this houses the all components related to the post component
export default class PostParent extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      AddComment: false,
      anchorEl: false,
      DisableSharing: false,
      DisableAddComments: false,
      PostFavorited: false,
      NumberOfFav: 10,
      Comments: [],
    };
  }

  componentDidMount = () => {};
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
  HandleFavoritePost = () => {
    if (this.state.PostFavorited === false) {
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
        this.context.GetPosts();
      });
    } else {
      ApiCall(
        "Delete",
        `${process.env.REACT_APP_BackEndUrl}/api/home/DeleteLikedPost/${this.props.post.postGuid}`
      ).then((results) => {
        this.context.GetPosts();
        this.setState({
          PostFavorited: !this.state.PostFavorited,
        });
      });
    }
  };

  //this function handles various clicks the related to the post menu
  HandlePostMenClick = (ButtonClicked) => {
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
      ApiCall(
        "Delete",
        `${process.env.REACT_APP_BackEndUrl}/api/home/DeletePost/${this.props.post.postGuid}`
      ).then((results) => {
        this.context.OpenNoti("Post Deleted");
        this.context.GetPosts();
      });
    }

    this.ClosePostMenu();
  };

  //this displays the comments the post
  HandleAddCommentClick = () => {
    this.GetComments();
    this.setState({
      AddComment: !this.state.AddComment,
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

  RenderLikedPosts = () => {
    /*
    let products = this.state.IntialProducts;
    //returns all products that match the search phrase
    products = products.filter((product) => {
      return (
        product.name
          .toLowerCase()
          .search(SearchTextBoxVal.toString().toLowerCase()) !== -1
      );
    });
    //sets state of products to be displayed
    this.setState({ products: products });
    */
    console.log(this.context.Likes);
    var likes = this.context.Likes;
    likes = likes.filter((like) => {
      return like.toLowerCase;
    });
  };

  render() {
    this.RenderLikedPosts();
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
        <Collapse in={this.state.AddComment} timeout="auto" unmountOnExit>
          <Divider />
          {this.state.Comments.map((comment) => (
            <PostComment
              GetComments={this.GetComments}
              comment={comment}
              OpenNoti={this.OpenNoti}
            />
          ))}
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

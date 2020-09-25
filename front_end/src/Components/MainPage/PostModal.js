import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { ApiCall } from "../SharedComponents/ApiCall";
import moment from "moment";
import { uuidv4 } from "../SharedComponents/SharedFunctions";
import Context from "../SharedComponents/context";

//component loads the first add post or edit post modal
export default class PostModal extends Component {
  static contextType = Context;
  state = { Post: "" };

  componentDidMount = () => {
    if (this.props.ModalType === "Edit") {
      this.setState({
        Post: this.props.post.postContent,
      });
    }
  };

  //submits the post information to the appropriate end point
  SubmitPost = () => {
    if (this.props.ModalType === "Edit") {
      var MyData = {};
      var PostGuid = uuidv4();
      MyData.UpdatePostData = {
        PostGuid: this.props.post.postGuid,
        PostContent: this.state.Post,
        DateCreated: this.props.post.dateCreated,
      };

      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/home/UpdatePost/UpdatePost`,
        MyData
      ).then(() => {
        this.props.CloseModal();
        this.context.GetPosts();
        this.context.OpenNoti("Post was Updated");
      });
    } else {
      var MyData = {};
      MyData.AddPost = {
        PostGuid: uuidv4(),
        PostContent: this.state.Post,
        DateCreated: moment().format("LL"),
      };

      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/home/AddPost`,
        MyData
      ).then(() => {
        this.props.CloseModal();
        this.context.GetPosts();
        this.context.OpenNoti("Post was Added");
      });
    }
  };

  //keeps track of user input as they type text in
  HandleUpdate = (NewState) => {
    this.setState(NewState);
  };

  render() {
    return (
      <div>
        <Card>
          <CardHeader
            avatar={<Avatar>R</Avatar>}
            classes={{
              root: "TextAllignLeft",
            }}
            title="BIB BOB | Public"
          />
          <CardContent>
            <TextField
              value={this.state.Post}
              onChange={(event) =>
                this.HandleUpdate({ Post: event.target.value })
              }
              fullWidth={true}
              label="What's new with you?"
            />
          </CardContent>

          <CardActions disableSpacing>
            <div className="PostIconStyle">
              <Button onClick={this.props.CloseModal}>CANCEL</Button>

              <Button
                onClick={this.SubmitPost}
                disabled={this.state.Post.trim() !== "" ? "" : true}
              >
                POST
              </Button>
            </div>
          </CardActions>
        </Card>
      </div>
    );
  }
}

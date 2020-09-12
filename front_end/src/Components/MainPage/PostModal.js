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

export default class PostModal extends Component {
  static contextType = Context;
  state = { Post: "" };

  SubmitPost = () => {
    var MyData = {};
    var PostGuid = uuidv4();
    MyData.AddPost = {
      PostGuid: PostGuid,
      PostContent: this.state.Post,
      DateCreated: moment().format("LL"),
    };

    ApiCall(
      "Post",
      `${process.env.REACT_APP_BackEndUrl}/api/home/AddPost`,
      MyData
    ).then(() => {
      this.props.CloseModal();
      debugger;
      this.context.OpenNoti("Post was Added");
    });
  };

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

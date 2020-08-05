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

export default class AddPostModal extends Component {
  state = { Post: "" };

  SubmitPost = () => {};

  HandleUpdate = (NewState) => {
    this.setState(NewState);
  };

  render() {
    return (
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
    );
  }
}

import React, { Component } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";

export default class AddPostComment extends Component {
  state = {
    AddPostCommentVal: "",
  };

  onChange = (newState) => {
    this.setState(newState);
  };
  render() {
    return (
      <div>
        <CardHeader
          avatar={<Avatar>R</Avatar>}
          classes={{
            root: "TextAllignLeft",
          }}
          title={
            <InputBase
              onChange={(event) =>
                this.onChange({ AddPostCommentVal: event.target.value })
              }
              value={this.state.AddPostCommentVal}
              classes={{ root: "AddPostInput" }}
              placeholder="Add a comment"
              inputProps={{ "aria-label": "search" }}
            />
          }
        />

        <CardActions disableSpacing>
          <div className="PostIconStyle">
            <Button
              disabled={Boolean(!this.state.AddPostCommentVal)}
              onClick={this.Submit}
            >
              POST
            </Button>
          </div>
        </CardActions>
      </div>
    );
  }
}

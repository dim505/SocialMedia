import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grow from "@material-ui/core/Grow";
import { ApiCall } from "../../../SharedComponents/ApiCall";

//component shows the edit comment
export default class EditPostComment extends Component {
  state = {
    PostComment: "edit post ",
  };

	//keeps track of comment being typed in 
  handleChange = (newState) => {
    this.setState(newState);
  };


  componentDidMount = () => {
    this.setState({
      Post: this.props.comment.commentContent
    });
  };
  
  //submits comment values
  Submit = () => {
    var MyData = {};
    MyData.AddComment = {
      CommentGuid: this.props.comment.CommentGuid,
    };

    ApiCall(
      "Post",
      `${process.env.REACT_APP_BackEndUrl}/api/home/EditComment`,
      MyData
    ).then(() => {
      this.props.HandleAddCommentClick();
      this.context.OpenNoti("Comment was Added");
    });
  };

  render() {
    return (
      <Grow timeout={500} in={true}>
        <div>
          <TextField
            id="standard-full-width"
            label=""
            style={{ margin: 8 }}
            placeholder=""
            helperText=""
            fullWidth
            onChange={(event) => {
              this.handleChange({ PostComment: event.target.value });
            }}
            value={this.state.PostComment}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div className="EditPostCommentButton">
            <Button
              color="primary"
              onClick={() => this.props.CloseEditComment()}
            >
              Cancel
            </Button>
            <Button
              onClick={() => this.Submit()}
              disabled={Boolean(!this.state.PostComment.trim())}
              color="primary"
            >
              Update
            </Button>
          </div>
        </div>
      </Grow>
    );
  }
}

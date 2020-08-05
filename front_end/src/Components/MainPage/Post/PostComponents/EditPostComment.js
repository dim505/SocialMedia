import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grow from "@material-ui/core/Grow";

export default class EditPostComment extends Component {
  state = {
    Post: "edit post "
  };

  handleChange = newState => {
    this.setState(newState);
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
            onChange={event => {
              this.handleChange({ Post: event.target.value });
            }}
            value={this.state.Post}
            margin="normal"
            InputLabelProps={{
              shrink: true
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
              onClick={() => this.props.CloseEditComment("Update Secuessful")}
              disabled={Boolean(!this.state.Post.trim())}
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

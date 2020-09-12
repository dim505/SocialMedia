import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import SharedModal from "../SharedComponents/SharedModal";
import PostModal from "./PostModal";

export default class AddPostButton extends Component {
  state = {
    OpnModal: false,
  };

  //opens make payment modal
  OpnModal = () => {
    this.setState({
      OpnModal: true,
    });
  };
  //closes make payment modal
  CloseModal = () => {
    this.setState({
      OpnModal: false,
    });
  };

  render() {
    return (
      <div>
        <Paper elevation={3}>
          <Button onClick={() => this.OpnModal()} fullWidth={true}>
            <Avatar />

            <p id="PostStatus"> Whats New With You? </p>
          </Button>
        </Paper>

        <SharedModal
          OpnModal={this.state.OpnModal}
          CloseModal={this.CloseModal}
        >
          <div className="PostModal ">
            <PostModal CloseModal={this.CloseModal} />
          </div>
        </SharedModal>
      </div>
    );
  }
}

import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import SharedModal from "../SharedComponents/SharedModal";
import PostModal from "./PostModal";
import Context from "../SharedComponents/context";
//button used to open modal to add a new post
export default class AddPostButton extends Component {
  static contextType = Context;

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
            <Avatar 
            alt={this.context.AccountInfo[0].fullName}
            src={this.context.AccountInfo[0].profilePhotoUrl} />

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

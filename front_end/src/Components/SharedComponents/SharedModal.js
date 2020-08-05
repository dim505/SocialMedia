import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";

//component act as a modal template
export default class SharedModal extends Component {
  render() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.props.OpnModal}
        onClose={this.props.CloseModal}
      >
        <Fade in={this.props.OpnModal} timeout={500}>
          <div className="ModalStyle">{this.props.children}</div>
        </Fade>
      </Modal>
    );
  }
}

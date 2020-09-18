import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import Avatar from "@material-ui/core/Avatar";
import { DropzoneArea } from "material-ui-dropzone";
import AddAPhotoOutlinedIcon from "@material-ui/icons/AddAPhotoOutlined";
import Fade from "@material-ui/core/Fade";


//this component displays the upload file area when uploading a profile picture or banner picture
export default class UploadPhoto extends Component {
  render() {
    return (
      <Dialog
        open={this.props.ShowPhotoUpload}
        onClose={this.props.ClosePhotoUpload}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DropzoneArea
            acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
            filesLimit={1}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.ClosePhotoUpload}> Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.ClosePhotoUpload}
            color="primary"
            autoFocus
          >
            Upload Photo
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

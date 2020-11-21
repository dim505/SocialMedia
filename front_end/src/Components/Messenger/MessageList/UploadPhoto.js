import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import LinearProgress from "@material-ui/core/LinearProgress";

//import { ApiCall } from "../ApiCall";
//import Context from "../context";
import { DropzoneArea } from "material-ui-dropzone";

//this component displays the upload file area when uploading a profile picture or banner picture
export default class UploadPhoto extends Component {
  state = {
    files: [],
    ShowLoader: false
  };
  //static contextType = Context;

  HandleFileDrag = (files) => {
    this.setState({
      files: files
    });
  };

  UploadPhoto = async () => {
    var MyData = {};
    var Filename = "";
    this.setState({
      ShowLoader: true
    });

    var ext = this.state.files[0].name.split(".").pop();

    Filename =
    window.channelName + this.state.files[0].name.split(".")[0] +
      this.state.files[0].name.lastIndexOf(".") +
      "." +
      ext;
    MyData.AccountInfo = {
      BannerPhotoUrl:
        "https://shellstorage123.blob.core.windows.net/socialmedia/" + Filename
    };

    window.containerClient = window.blobServiceClient.getContainerClient(
      "socialmedia"
    );

    const blockBlobClient = window.containerClient.getBlockBlobClient(Filename);
    const uploadBlobResponse = await blockBlobClient.uploadBrowserData(
      this.state.files[0]
    );
    window.Filename = Filename;
    this.props.UpdateMessage(
      "https://shellstorage123.blob.core.windows.net/socialmedia/" + Filename
    );
    this.props.ClosePhotoUpload();
  };

  render() {
    return (
      <Dialog
        open={this.props.ShowPhotoUpload}
        onClose={() => this.props.ClosePhotoUpload()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {this.state.ShowLoader ? <LinearProgress /> : null}
        <DialogContent>
          <DropzoneArea
            fullWidth={true}
            showPreviews={false}
            filesLimit={1}
            onChange={this.HandleFileDrag.bind(this)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.ClosePhotoUpload()}> Cancel</Button>
          <Button
            disabled={this.state.files.length == 0}
            variant="contained"
            color="primary"
            onClick={() => this.UploadPhoto()}
            color="primary"
            autoFocus
          >
            Upload File
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

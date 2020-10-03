import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import { ApiCall } from "../ApiCall";
import Context from "../context";
import { DropzoneArea } from "material-ui-dropzone";

//this component displays the upload file area when uploading a profile picture or banner picture
export default class UploadPhoto extends Component {
  static contextType = Context;

  HandleFileDrag = (files) => {
    this.setState({
      files: files,
    });
  };

  UploadPhoto = (Filename) => {
    var MyData = {};

    if (this.props.FileTypeBeingUploaded === "BannerPhoto") {
      MyData.AccountInfo = {
        BannerPhotoUrl: Filename,
      };

      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/Profile/Add_Update_Account_Info/UpdateProfilePhoto`,
        MyData
      ).then(() => {
        this.setState({
          ShowPhotoUpload: false,
          ProfileUrl:
            "https://shellstorage123.blob.core.windows.net/socialmedia/" +
            Filename,
        });
        this.context.OpenNoti("Banner Photo Uploaded");
      });
    } else if (this.props.FileTypeBeingUploaded === "ProfilePhoto") {
      MyData.AccountInfo = {
        ProfilePhotoUrl: Filename,
      };

      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/Profile/Add_Update_Account_Info/UpdateBannerPhoto`,
        MyData
      ).then(() => {
        this.setState({
          ShowPhotoUpload: false,
          BannerUrl:
            "https://shellstorage123.blob.core.windows.net/socialmedia/" +
            Filename,
        });
      });

      this.context.OpenNoti("Profile Photo Uploaded");
    }
  };

  render() {
    return (
      <Dialog
        open={this.props.ShowPhotoUpload}
        onClose={() => this.props.ClosePhotoUpload()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DropzoneArea
            acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
            filesLimit={1}
            onChange={this.HandleFileDrag.bind(this)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.ClosePhotoUpload()}> Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.UploadPhoto()}
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

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
import ProfilePic from "../../download.jpg";
import Avatar from "@material-ui/core/Avatar";
import UploadPhoto from "./UploadPhoto";
import AddAPhotoOutlinedIcon from "@material-ui/icons/AddAPhotoOutlined";
import Fade from "@material-ui/core/Fade";
import SnackBar from "../SnackBar";
import Tooltip from "@material-ui/core/Tooltip";
import BackgroundBanner from "../BackgroundBanner";
import download from "../../download.jpg";

export default class ProQckStatsEditProDiag extends Component {
  state = {
    ShowPhotoUpload: false,
    OpenNoti: false,
    Message: "",
  };

  ClosePhotoUpload = () => {
    this.setState({
      ShowPhotoUpload: false,
    });

    this.OpenNoti("Profile Photo Uploaded");
  };

  //function opens notification alert
  OpenNoti = (message) => {
    this.setState({
      OpenNoti: true,
      Message: message,
    });
  };
  //function closes  notification alert
  CloseNoti = () => {
    this.setState({
      OpenNoti: false,
    });
  };

  HandleUpdateClick = () => {
    //this.props.OpenNoti2("Profile Updated");
    this.props.CloseDialog();
  };

  render() {
    return (
      <Dialog
        open={this.props.OpenDialog}
        onClose={this.props.CloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <BackgroundBanner picture={download} PictureSize="200px" />
          <div className="Avatar_Center">
            <Avatar
              classes={{
                root: "AvatarStyle",
              }}
              alt="Remy Sharp"
              src={ProfilePic}
            />
            <Tooltip title="Click To Add Profile Photo">
              <AddAPhotoOutlinedIcon
                onClick={() => {
                  this.setState({
                    ShowPhotoUpload: true,
                  });
                }}
                classes={{
                  root: "ChangeAvatarPic",
                }}
              />
            </Tooltip>
            <Typography
              classes={{
                root: "EditProfileModalName",
              }}
              variant="h3"
              gutterBottom
            >
              BOB
            </Typography>
            <Tooltip title="Click To Upload Banner Photo">
              <AddAPhotoOutlinedIcon
                onClick={() => {
                  this.setState({
                    ShowPhotoUpload: true,
                  });
                }}
                classes={{
                  root: "UploadBannerIcon",
                }}
              />
            </Tooltip>
          </div>
          <Paper
            classes={{
              root: "EditProfileModalForm",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Personal Information
            </Typography>
            <TextField fullWidth id="standard-basic" label="Full Name" />
            <TextField fullWidth id="standard-basic" label="Tagline" />
            <TextField fullWidth id="standard-basic" label="Company Name" />
            <TextField fullWidth id="standard-basic" label="Twitter" />
            <TextField fullWidth id="standard-basic" label="Facebook Page" />
            <TextField fullWidth id="standard-basic" label="Web Address" />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.CloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.HandleUpdateClick}
            color="primary"
            autoFocus
          >
            Update
          </Button>
        </DialogActions>

        <UploadPhoto
          ClosePhotoUpload={this.ClosePhotoUpload}
          ShowPhotoUpload={this.state.ShowPhotoUpload}
        />

        <SnackBar
          OpenNoti={this.state.OpenNoti}
          CloseNoti={this.CloseNoti}
          message={this.state.Message}
        />
      </Dialog>
    );
  }
}

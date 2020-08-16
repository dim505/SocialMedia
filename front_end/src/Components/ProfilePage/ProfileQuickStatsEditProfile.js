import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ProQckStatsEditProDiag from "../SharedComponents/EditProfileModal/ProQckStatsEditProDiag";
import BackgroundBanner from "../SharedComponents/BackgroundBanner";
import SnackBar from "../SharedComponents/SnackBar";

export default class ProfileQuickStatsEditProfile extends Component {
  state = {
    OpenDialog: false,
    OpenNoti: false,
    Message: "",
  };

  OpenDialog = () => {
    this.setState({
      OpenDialog: true,
    });
  };

  CloseDialog = () => {
    this.setState({
      OpenDialog: false,
    });
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

  render() {
    return (
      <div>
        <Paper
          classes={{
            root: "EditProfileCard",
          }}
          square={false}
          elevation={3}
        >
          <div className="AvatarCenter">
            <Avatar
              classes={{
                root: "AvatarStyle",
              }}
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
            />
          </div>
          <Typography
            classes={{
              root: "EditProfileName",
            }}
            variant="h5"
            gutterBottom
          >
            Bob
          </Typography>

          <Button
            onClick={() => {
              this.OpenDialog();
            }}
            color="primary"
          >
            Edit Profile
          </Button>
        </Paper>

        <ProQckStatsEditProDiag
          OpenNoti2={() => this.OpenNoti()}
          OpenDialog={this.state.OpenDialog}
          CloseDialog={this.CloseDialog}
        />

        <SnackBar
          OpenNoti={this.state.OpenNoti}
          CloseNoti={this.CloseNoti}
          message={this.state.Message}
        />
      </div>
    );
  }
}

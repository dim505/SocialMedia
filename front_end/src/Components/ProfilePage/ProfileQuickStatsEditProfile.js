import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ProQckStatsEditProDiag from "../SharedComponents/EditProfileModal/ProQckStatsEditProDiag";
import BackgroundBanner from "../SharedComponents/BackgroundBanner";
import SnackBar from "../SharedComponents/SnackBar";
import Context from "../SharedComponents/context";

//this shows the edit account into card when going to the people page
export default class ProfileQuickStatsEditProfile extends Component {
  static contextType = Context;

  state = {
    OpenDialog: false,
    OpenNoti: false,
    Message: "",
  };

  //opens dialog to edit the user profile information
  OpenDialog = () => {
    this.setState({
      OpenDialog: true,
    });
  };

  //closes dialog to edit the user profile information
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

  RenderProfileButton = () => {
        if (window.ViewUserProfile === '-1') {
          return (<Button
            onClick={() => {
              this.OpenDialog();
            }}
            color="primary"
          >
              Edit Profile 
          </Button>)

        } else if (this.context.AccountInfo[0].isUserAFollower === '-1') {
              return ( <div/>    )

        } else {

          return (<Button
            onClick={() => {
              this.OpenDialog();
            }}
            color="primary"
          >
              View Profile Info
          </Button>)

        }

  }

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
              src={this.context.AccountInfo[0].profilePhotoUrl}
            />
          </div>
          <Typography
            classes={{
              root: "EditProfileName",
            }}
            variant="h5"
            gutterBottom
          >
            {this.context.AccountInfo[0].fullName}
          </Typography>
              {this.RenderProfileButton()}
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

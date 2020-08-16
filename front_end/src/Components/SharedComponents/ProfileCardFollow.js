import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ProQckStatsEditProDiag from "../SharedComponents/EditProfileModal/ProQckStatsEditProDiag";

export default class ProfileCardFollow extends Component {
  state = {
    IsFollow: false,
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
              this.setState({
                IsFollow: !this.state.IsFollow,
              });
            }}
            color="primary"
          >
            {this.state.IsFollow === true ? "Follow" : "Following"}
          </Button>
        </Paper>
      </div>
    );
  }
}

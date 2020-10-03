import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ProQckStatsEditProDiag from "../SharedComponents/EditProfileModal/ProQckStatsEditProDiag";
import { ApiCall } from "../SharedComponents/ApiCall";

//this card shows the person who you are following info card
export default class ProfileCardFollow extends Component {
  state = {
    IsFollow: false,
  };

  HandleFollowUnfollow = () => {
    if (this.state.IsFollow === true) {
      this.setState({
        IsFollow: !this.state.IsFollow,
      });
      /*
      ApiCall(
        "Get",
        `${process.env.REACT_APP_BackEndUrl}/api/People/FollowPerson/{props.Auth0ID}`
      ).then((results) => {
        if (results.length > 0) {
          this.setState({
            IsFollow: !this.state.IsFollow,
          });
        }
      });*/
    } else if (this.state.IsFollow === false) {
      this.setState({
        IsFollow: !this.state.IsFollow,
      });
      /*
      ApiCall(
        "Get",
        `${process.env.REACT_APP_BackEndUrl}/api/People/DeleteFollowPerson/{props.Auth0ID}`
      ).then((results) => {
        if (results.length > 0) {
          this.setState({
            IsFollow: !this.state.IsFollow,
          });
        }
      });*/
    }
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
            this.props.person
          </Typography>

          <Button
            onClick={() => {
              this.HandleFollowUnfollow();
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

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

  componentDidMount() {
    if (this.props.IsFollow === true) {
      this.setState({
        IsFollow: true,
      });
    }
  }

  HandleFollowUnfollow = () => {
    if (this.state.IsFollow === false) {
      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/People/FollowPerson/${this.props.Person.auth0ID}`
      ).then((results) => {
        this.setState({
          IsFollow: true,
        });
        this.props.GetData();
      });
    } else if (this.state.IsFollow === true) {
      ApiCall(
        "Delete",
        `${process.env.REACT_APP_BackEndUrl}/api/People/DeleteFollowPerson/${this.props.Person.followingAuth0ID}`
      ).then((results) => {
        this.setState({
          IsFollow: false,
        });
        this.props.GetData();
      });
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
              src={this.props.Person.profilePhotoUrl}
            />
          </div>
          <Typography
            classes={{
              root: "EditProfileName",
            }}
            variant="h5"
            gutterBottom
          >
            {this.props.Person.fullName}
          </Typography>

          <Button
            onClick={() => {
              this.HandleFollowUnfollow();
            }}
            color="primary"
          >
            {this.state.IsFollow === true ? "Following" : "Follow"}
          </Button>
        </Paper>
      </div>
    );
  }
}

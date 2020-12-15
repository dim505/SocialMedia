import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ProQckStatsEditProDiag from "../SharedComponents/EditProfileModal/ProQckStatsEditProDiag";
import { ApiCall } from "../SharedComponents/ApiCall";
import Tooltip from "@material-ui/core/Tooltip";
import Context from "./context";
import "./ShareComponents.scss";
//this card shows the person who you are following info card
export default class ProfileCardFollow extends Component {
  static contextType = Context;
  state = {
    IsFollow: false,
  };

  componentDidMount() {
    if (this.props.IsFollow === true || this.props.Person.IsFollow === true) {
      this.setState({
        IsFollow: true,
      });
    }
  }

	//updates the follow/following status 
  HandleFollowUnfollow = () => {
    if (this.state.IsFollow === false) {
      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/People/FollowPerson/${this.props.Person.auth0ID}`
      ).then((results) => {
       /* this.setState({
          IsFollow: true,
        });*/
        this.context.OpenNoti("You are following " + this.props.Person.fullName, 2000)
        this.context.GetMainPagePosts()
        this.props.GetData();
      });
    } else if (this.state.IsFollow === true) {
      ApiCall(
        "Delete",
        `${process.env.REACT_APP_BackEndUrl}/api/People/DeleteFollowPerson/${this.props.Person.followingAuth0ID}`
      ).then((results) => {
       /* this.setState({
          IsFollow: false,
        }); */
        this.context.OpenNoti("You are unfollowing " + this.props.Person.fullName, 2000)
        this.context.GetMainPagePosts()
        this.props.GetData();
      });
    }
  };

  //redirects user to profile page when trying to view users profile 
  Redirect = () => {
    window.ViewUserProfile = this.props.Person.auth0ID
	  this.context.GetProfilePagePosts()
    this.context.GetAccountInfo()
    this.context.RedirectToPage("/Profile")	  
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
          <Tooltip title="Click to View Profile">
            <Avatar
			onClick={() => this.Redirect()}
              classes={{
                root: "AvatarStyle",
              }}
              alt={this.props.Person.fullName} 
              src={this.props.Person.profilePhotoUrl}
            />
            </Tooltip>
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
          {this.props.Disable  ?   <div></div>         
           : <Button
           onClick={() => {
             this.HandleFollowUnfollow();
           }}
           color="primary"
         >
           {this.state.IsFollow === true ? "Following" : "Follow"}
         </Button>   }

        </Paper>
      </div>
    );
  }
}

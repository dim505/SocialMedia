import React, { Component } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";


//shows the log in screen when the app first loads 
export default class LogInScreen extends Component {
  //redirects user to log in page
  Login = () => {
    this.props.auth.loginWithRedirect();
  };

  render() {
    return (
      <div>
        <AccountCircleIcon style={{ fontSize: 48 }} />
        <Typography variant="h5" gutterBottom>
          Welcome To Fusion Connect
        </Typography>

        <Button variant="outlined" onClick={this.Login}>
          Log In or Sign Up
        </Button>
      </div>
    );
  }
}

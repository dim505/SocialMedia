import React, { Component } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Tooltip from "../SharedComponents/Tooltip";
import LiveHelpOutlinedIcon from "@material-ui/icons/LiveHelpOutlined";
import Context from "../SharedComponents/context";

//shows the log in screen when the app first loads 
export default class LogInScreen extends Component {
  static contextType = Context;
  
  //redirects user to log in page
  Login = () => {
    this.props.auth.loginWithRedirect();
  };
  
  componentDidMount () {
    this.context.OpenNoti("Please note, only Chrome and Edge Chromium is being supported at this time")
  }

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
		
		          <Tooltip
            placement="bottom"
            tooltip="Would you like to Log in without creating an account?
                         Please use these credentials:
                         **** Username: test@mailinator.com ****
                         **** Password: Abcd@1234 *****       
                         "
          >
            <LiveHelpOutlinedIcon
            classes={{
              root: "HelpIcon"
            }}
            fontSize="large" />
		  </Tooltip>
      </div>
    );
  }
}

import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import GroupAddIcon from "@material-ui/icons/GroupAdd";


//this component shows come quick stats regarding the users profile
export default class ProfileImpact extends Component {
  render() {
    return (
      <Paper square={false} elevation={3}>
        <Typography
          classes={{
            root: "ImpactHeader"
          }}
          variant="h6"
          gutterBottom
        >
          Impact
        </Typography>

        <List component="nav" aria-label="main mailbox folders">
          <ListItem button>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="0 Like" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText primary="0 Share" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="0 Publish" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <GroupAddIcon />
            </ListItemIcon>
            <ListItemText primary="0 Following" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="0 Follwers" />
          </ListItem>
        </List>
      </Paper>
    );
  }
}

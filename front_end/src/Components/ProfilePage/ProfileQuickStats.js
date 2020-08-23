import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PostParent from "../MainPage/Post/PostParent";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ProfileQuickStatsEditProfile from "./ProfileQuickStatsEditProfile";
import BackgroundBanner from "../SharedComponents/BackgroundBanner";
import download from "../download.jpg";

export default class ProfileQuickStats extends Component {
  render() {
    return (
      <div>
        <BackgroundBanner picture={download} PictureSize="384px" />
        <Grid
          container
          classes={{
            container: "ProfileQuickStatGrid",
          }}
        >
          <Grid item xs={2} />

          <Grid item xs={3}>
            <ProfileQuickStatsEditProfile />
          </Grid>

          <Grid item xs={3}>
            <Paper square={false} elevation={3}>
              <Typography
                classes={{
                  root: "ImpactHeader",
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
          </Grid>
          <Grid item xs={3}>
            <Paper square={false} elevation={3}>
              {" "}
              nein nine ine{" "}
            </Paper>
          </Grid>

          <Grid item xs={1} />

          <div className="ProfileTitle"> Bobs Posts</div>
        </Grid>

        <Grid container>
          <Grid item>
            <PostParent />
          </Grid>

          <Grid item>
            <PostParent />
          </Grid>

          <Grid item>
            <PostParent />
          </Grid>

          <Grid item>
            <PostParent />
          </Grid>
        </Grid>
      </div>
    );
  }
}

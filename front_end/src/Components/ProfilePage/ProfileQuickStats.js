import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Context from "../SharedComponents/context";
import ProfileQuickStatsEditProfile from "./ProfileQuickStatsEditProfile";
import BackgroundBanner from "../SharedComponents/BackgroundBanner";
import download from "../download.jpg";
import ProfileImpact from "./ProfileImpact";
import PostParent from "../MainPage/Post/PostParent";

//this component is the parent that houses the people page 
export default class ProfileQuickStats extends Component {
  static contextType = Context;

  render() {
    return (
      <div>
        <BackgroundBanner picture={download} PictureSize="384px" />
        <Grid
          container
          classes={{
            container: "ProfileQuickStatGrid",
          }}
          justify="center"
        >
          <Grid item lg={4} md={4} sm={6} xs={12}>
            <ProfileQuickStatsEditProfile />
          </Grid>

          <Grid item lg={4} mg={4} sm={6} xs={12}>
            <ProfileImpact />
          </Grid>
        </Grid>
        <div className="ProfileTitle"> Bobs Posts</div>
        <Grid spacing={1} container>
          {this.context.Posts.length === 0 ? (
            <h1>No Posts..... Please add some </h1>
          ) : (
            this.context.Posts.map((post) => (
              <Grid item lg={4} md={6} xs={12}>
                <PostParent post={post} />
              </Grid>
            ))
          )}
        </Grid>
      </div>
    );
  }
}

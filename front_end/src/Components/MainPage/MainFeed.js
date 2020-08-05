import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import AddNewFeedButton from "./AddPostButton";
import PostParent from "./Post/PostParent";
import EditPostComment from "./Post/PostComponents/EditPostComment";

export default class MainFeed extends Component {
  render() {
    return (
      <Grid
        classes={{
          container: "GridContainer",
        }}
        container={true}
        spacing={3}
      >
        <Grid item xs={4} />
        <Grid item xs={4}>
          <AddNewFeedButton />
        </Grid>
        <Grid item xs={4} />

        <Grid item xs={12}>
          <PostParent />
        </Grid>
        <Grid item xs={12} />
      </Grid>
    );
  }
}

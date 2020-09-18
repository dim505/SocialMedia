import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import AddNewFeedButton from "./AddPostButton";
import PostParent from "./Post/PostParent";
import Context from "../SharedComponents/context";


//displays all the component on the main page / home page 
export default class MainFeed extends Component {
  static contextType = Context;

  render() {
    console.log(this.context);
    return (
      <Grid
        classes={{
          container: "GridContainer",
        }}
        container={true}
        spacing={3}
        justify="center"
      >
        <Grid container={true} spacing={3} justify="center">
          <Grid justify="center" item>
            <AddNewFeedButton />
          </Grid>
        </Grid>{" "}
        {this.context.Posts.length === 0 ? (
          <h1>No Posts..... Please add some </h1>
        ) : (
          this.context.Posts.map((post) => (
            <Grid item lg={4} md={4} sm={6} xs={12}>
              <PostParent post={post} />
            </Grid>
          ))
        )}
      </Grid>
    );
  }
}

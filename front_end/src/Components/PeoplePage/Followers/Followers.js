import React, { Component } from "react";
import ProfileCardFollow from "../../SharedComponents/ProfileCardFollow";
import Grid from "@material-ui/core/Grid";

export default class Followers extends Component {
  render() {
    return (
      <div>
        <div className="ProfileTitle"> Followers </div>
        <Grid container={true}>
          <Grid item xs={1} />
          <Grid item xs={3}>
            <ProfileCardFollow />
          </Grid>

          <Grid item xs={3}>
            <ProfileCardFollow />
          </Grid>

          <Grid item xs={3}>
            <ProfileCardFollow />
          </Grid>
        </Grid>
      </div>
    );
  }
}

import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import ProfileCardFollow from "../../SharedComponents/ProfileCardFollow";

export default class FindPeopleParent extends Component {
  render() {
    return (
      <div>
        <div className="ProfileTitle"> Suggestions for you</div>
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

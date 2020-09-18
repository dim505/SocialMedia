import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import ProfileCardFollow from "../../SharedComponents/ProfileCardFollow";
import YourCircles from "./YourCircles";



//contains components related the find people tab in the people page 
export default class FindPeopleParent extends Component {
  render() {
    return (
      <div>
        <div className="ProfileTitle"> Following </div>

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

        <YourCircles />
      </div>
    );
  }
}

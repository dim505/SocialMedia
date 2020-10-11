import React, { Component } from "react";
import ProfileCardFollow from "../../SharedComponents/ProfileCardFollow";
import Grid from "@material-ui/core/Grid";

//compoent shows the people you are following
export default class Followers extends Component {
  render() {
    return (
      <div>
        <div className="ProfileTitle"> Followers </div>
        <Grid container={true}>
          {this.props.Followers.length > 0 ? (
            this.props.Followers.map((Person) => (
              <Grid item lg={4} md={6} xs={12} xs={3}>
                <ProfileCardFollow 
                Disable={true}
                Person={Person} />
              </Grid>
            ))
          ) : (
            <h3>No Followers found</h3>
          )}
        </Grid>
      </div>
    );
  }
}

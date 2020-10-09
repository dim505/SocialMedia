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
          {this.props.Following.length > 0 ? (
            this.props.Following.map((Person) => (
              <Grid item lg={4} md={6} xs={12} xs={3}>
                <ProfileCardFollow
                  GetData={() => this.props.GetData()}
                  IsFollow={true}
                  Person={Person}
                />
              </Grid>
            ))
          ) : (
            <h3>You are not following anyone :C</h3>
          )}
        </Grid>

        <YourCircles />
      </div>
    );
  }
}

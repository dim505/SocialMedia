import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import ProfileCardFollow from "../../SharedComponents/ProfileCardFollow";

//contains component related the find people tab in the people page
export default class FindPeopleParent extends Component {
  render() {
    return (
      <div>
        <div className="ProfileTitle"> Suggestions for you</div>
        <Grid container={true}>
          {this.props.FindPeople.length > 0 ? (
            this.props.FindPeople.map((Person) => (
              <Grid item lg={4} md={6} xs={12} xs={3}>
                <ProfileCardFollow
                  GetData={() => this.props.GetData()}
                  Person={Person}
                />
              </Grid>
            ))
          ) : (
            <h3>No People found</h3>
          )}
        </Grid>
      </div>
    );
  }
}

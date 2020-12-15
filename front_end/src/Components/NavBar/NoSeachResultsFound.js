import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";


//displays no results when the users search term brings back no results 
export default class NoSeachResultsFound extends Component {
  render() {
    return (
      <Typography
        classes={{
          body1: "SearchResFont"
        }}
        variant="body1"
        gutterBottom
      >
        Sorry, no {this.props.value === 0 ? "post" : "user"} results for {window.SearchTerm}
      </Typography>
    );
  }
}

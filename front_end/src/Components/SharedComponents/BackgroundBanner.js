import React, { Component } from "react";

export default class BackgroundBanner extends Component {
  state = {
    AddPostCommentVal: ""
  };
  render() {
    debugger;
    const Styles = {
      Background: {
        backgroundImage: `url(${this.props.picture})`,
        height: `${this.props.PictureSize}`,
        width: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no repeat",
        backgroundPosition: "center",
        backgroundColor: "#f7f7f7",
        borderRadius: 25
      }
    };

    return <div style={Styles.Background}> </div>;
  }
}

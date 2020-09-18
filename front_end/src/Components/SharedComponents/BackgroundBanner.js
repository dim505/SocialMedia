import React, { Component } from "react";


//component used to display the background image on the profile page
export default class BackgroundBanner extends Component {
  state = {
    AddPostCommentVal: "",
  };
  render() {
    const Styles = {
      Background: {
        backgroundImage: `url(${this.props.picture})`,
        height: `${this.props.PictureSize}`,
        width: "100%",
        backgroundSize: "cover",
        backgroundRepeat: "no repeat",
        backgroundPosition: "center",
        backgroundColor: "#f7f7f7",
        borderRadius: 25,
      },
    };

    return <div style={Styles.Background}> </div>;
  }
}

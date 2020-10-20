import React, { Component } from "react";
import "react-awesome-lightbox/build/style.css";
import Lightbox from "react-awesome-lightbox";
import Typography from "@material-ui/core/Typography";

export default class PostImage extends Component {
  state = { OpenLightBox: false };
  
  OpenLightBox = () => {
    this.setState({
      OpenLightBox: true
    });
  };

  CloseLightBox = () => {
    this.setState({
      OpenLightBox: false
    });
  };

  render() {
    return (
      <div>
        {this.state.OpenLightBox === true ? (
          <Lightbox
            onClose={() => this.CloseLightBox()}
            image={this.props.post.fileUrl}
          />
        ) : (
          ""
        )}
 
        <img
          onClick={() => this.OpenLightBox()}
          className="PostImage"
          src={this.props.post.fileUrl}
          alt="Img"
        />

        <Typography
          classes={{
            body1: "PostContent"
          }}
          variant="body1"
        >
		{this.props.post.postContent}
        </Typography>
      </div>
    );
  }
}

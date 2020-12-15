import React, { Component } from "react";
import ReactPlayer from "react-player";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
//displays video player for post should a employee upload a video 
export default class PostVideo extends Component {
  componentDidMount = () => {
    //Url = `https://shellstorage123.blob.core.windows.net/socialmediavideo/${this.props.PostGuid}`;
  };
  render() {
    return (
      <div>
        <ReactPlayer
          width="100%"
          controls={true}
          url={this.props.post.fileUrl}
        />

        <Typography
          classes={{
            body1: "PostContent"
          }}
          variant="body1"
          gutterBottom
        >
          {this.props.post.postContent}
        </Typography>
      </div>
    );
  }
}

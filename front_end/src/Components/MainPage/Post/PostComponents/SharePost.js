import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";

import {
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon
} from "react-share";

/*         <GooglePlusShareCount url={window.shareUrl} />
        <LinkedinShareCount url={window.shareUrl} />
        <PinterestShareCount url={window.shareUrl} />
        <RedditShareCount url={window.shareUrl} />
        <OKShareCount url={window.shareUrl} />
        <TumblrShareCount url={window.shareUrl} />
        <VKShareCount url={window.shareUrl} />*/
		
//this component shows the share icons when the share button is clicked 
export default class SharePost extends Component {
  render() {
    window.shareUrl = "google.com";
    return (
      <Paper elevation={3}>
        <TwitterShareButton url={window.shareUrl}>
          <TwitterIcon size={72} round={true} />
        </TwitterShareButton>
        <FacebookShareButton url={window.shareUrl}>
          <FacebookIcon size={72} round={true} />
        </FacebookShareButton>
        <LinkedinShareButton url={window.shareUrl}>
          <LinkedinIcon size={72} round={true} />
        </LinkedinShareButton>

        <EmailShareButton url={window.shareUrl}>
          <EmailIcon size={72} round={true} />
        </EmailShareButton>
      </Paper>
    );
  }
}

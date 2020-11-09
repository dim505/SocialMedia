import React, { Component } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MessageIcon from "@material-ui/icons/Message";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Context from "../../../SharedComponents/context";
import PostImage from "./PostImage"
import PostVideo from "./PostVideo"
//component contains the majority of the post includeing profile pic, post content and icons/FavoriteBorder
export default class Post extends Component {
  static contextType = Context;

  RenderPost = () => {
      if (this.props.post.fileType ==='Image') {
          return <PostImage post={this.props.post} />
      } else if (this.props.post.fileType ==='Video') {
          return <PostVideo post={this.props.post} />
      } else {
        return this.props.post.postContent
      }


  }
  render() {
    return (
      <div>
        <CardHeader
          avatar={
            <Avatar src={this.props.post.profilePhotoUrl}>R</Avatar>
          }
          action={
            window.ViewUserProfile === '-1' ? <div>
              <IconButton
                onClick={(e) => this.props.OpnPostMenu(e)}
                aria-label="settings"
              >
                <MoreVertIcon />
              </IconButton>
            </div> : <div></div>
          }
          classes={{
            root: "TextAllignLeft",
          }}
          title={this.props.post.fullName}
          subheader={this.props.post.dateCreated + " | Public"}
        />
        <CardContent>
          {" "}
          <Typography
            classes={{
              root: "TextAllignLeft",
            }}
            variant="body2"
            component="p"
          >
            {this.RenderPost()}
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <IconButton
            classes={{
              root: "FavoriteIconButton",
            }}
            onClick={() => this.props.HandleFavoritePost()}
            aria-label="add to favorites"
          >
            <FavoriteBorderIcon
              classes={{
                root:
                  this.props.post.didUserLikePost === "yes"
                    ? "FavoriteIconStyle"
                    : "",
              }}
            />
          </IconButton>
          <div className="NumFavorite">{this.props.post.postLikeCount}</div>
          <div className="PostIconStyle">
            <IconButton
              onClick={(event) => this.props.HandleAddCommentClick(event)}
              aria-label="show more"
            >
              <MessageIcon />
            </IconButton>
            {this.props.state.DisableSharing === true ? null : (
              <IconButton onClick={this.props.OpnModal} aria-label="share">
                <ShareIcon />
              </IconButton>
            )}
          </div>
        </CardActions>
      </div>
    );
  }
}

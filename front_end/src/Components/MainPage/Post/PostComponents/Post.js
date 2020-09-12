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

export default class Post extends Component {
  render() {
    return (
      <div>
        <CardHeader
          avatar={<Avatar>R</Avatar>}
          action={
            <div>
              <IconButton
                onClick={(e) => this.props.OpnPostMenu(e)}
                aria-label="settings"
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          }
          classes={{
            root: "TextAllignLeft",
          }}
          title="BIB BOB"
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
            {this.props.post.postContent}
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
                  this.props.PostFavorited === true ? "FavoriteIconStyle" : "",
              }}
            />
          </IconButton>
          <div className="NumFavorite">
            {this.props.PostFavorited === true ? this.props.NumberOfFav : ""}
          </div>
          <div className="PostIconStyle">
            <IconButton
              onClick={() => this.props.HandleAddCommentClick()}
              aria-label="show more"
            >
              <MessageIcon />
            </IconButton>
            {this.props.DisableSharing === true ? null : (
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

import React, { Component } from "react";
import "./ConversationListItem.css";
import Avatar from "@material-ui/core/Avatar";

//contains a single profile picture and a name for each conversation
export default class ConversationListItem extends Component {
  componentDidMount() {}

  //updates who is selected
  HandleConversationClick = (name, FollowingAuth0ID) => {
    this.props.HandleConversationClick(name, FollowingAuth0ID);
  };

  render() {
    return (
      <div
        Key={this.props.data.FollowingAuth0ID}
        onClick={() =>
          this.HandleConversationClick(
            this.props.data.FullName,
            this.props.data.FollowingAuth0ID
          )
        }
        className={`conversation-list-item ${
          this.props.ConvoSelected === this.props.data.FullName ? " selected" : ""
        }
    `}
      >
        <Avatar
          classes={{ root: "MessengerAvatarStyle" }}
          alt={this.props.data.FullName}
          src={this.props.data.LoggedInUserAuth0ID}
        />

        <div className="conversation-info">
          <h5 className="conversation-title">{this.props.data.FullName}</h5>
        </div>
      </div>
    );
  }
}

import React from "react";
import ConversationList from "./ConversationList/ConversationList";
import MessageList from "./MessageList/MessageList";
import "./Messenger.scss";
import Fade from "react-reveal/Fade";
import Grid from "@material-ui/core/Grid";
import { ApiCall } from "../SharedComponents/ApiCall";
import Context from "../SharedComponents/context";

//parent that houses the land lord chat application
export default class Messenger extends React.Component {
  static contextType = Context;
  state = {
    ConvoSelected: "",
    tenGuid: "",
    InitialConversations: [],
    OpenNewMessage: false,
    Users: []
  };

  //this tracks what conversation is being selected
  HandleConversationClick = (ConvoSelected, FollowingAuth0ID) => {
    window.FollowerAuth0ID = FollowingAuth0ID;
    this.setState({
      ConvoSelected: ConvoSelected,
      FollowingAuth0ID: FollowingAuth0ID,
      OpenNewMessage: false
    });
  };
  //updates the message header of the name/address of who was selected
  UpdateConvoList = (InitialConversations) => {
    this.setState({
      InitialConversations: InitialConversations
    });
  };

  //when somone wants to compose a new message, it brings the page to the top 
  OpenNewMessage = (OpenOrClose) => {

    this.setState({
      OpenNewMessage: OpenOrClose
    });
    document.getElementsByClassName("scrollable content")[0].scrollTop = 0
  };
  render() {
    return (
      <div className="messenger">
        <div className="scrollable sidebar">
          <ConversationList
          ConvoSelected={this.state.ConvoSelected}
            Users = {this.context.Users.filter((user) => {return user.ChatStarted === true}  )}
            OpenNewMessage={(OpenOrClose) => this.OpenNewMessage(OpenOrClose)}
            auth={this.props.auth}
            HandleConversationClick={this.HandleConversationClick}
            UpdateConvoList={this.UpdateConvoList}
          />
        </div>

        <div className="scrollable content">
          <MessageList
          GetUsers = {this.context.GetUsers}
            Users = {this.context.Users}
            OpenNewMessage={this.state.OpenNewMessage}
            ConvoSelected={this.state.ConvoSelected}
            FollowingAuth0ID={this.state.FollowingAuth0ID}
            HandleConversationClick={this.HandleConversationClick}
            InitialConversations={this.state.InitialConversations}
          />
        </div>
      </div>
    );
  }
}

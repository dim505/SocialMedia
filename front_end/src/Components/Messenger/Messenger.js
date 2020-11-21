import React from "react";
import ConversationList from "./ConversationList/ConversationList";
import MessageList from "./MessageList/MessageList";
import "./Messenger.scss";
import Fade from "react-reveal/Fade";
import Grid from "@material-ui/core/Grid";
import { ApiCall } from "../SharedComponents/ApiCall";

//parent that houses the land lord chat application
export default class Messenger extends React.Component {
  state = {
    ConvoSelected: "",
    tenGuid: "",
    InitialConversations: [],
    OpenNewMessage: false,
    Users: []
  };

  componentDidMount = () => {
      this.GetUsers()
  }

  GetUsers = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/Messenger/GetMessengerUsers`
    ).then((results) => {
      window.DataLoaded = false
      this.setState({
        Users: results,
      });
    });
  }
  //this tracks what conversation is being selected
  HandleConversationClick = (ConvoSelected, FollowingAuth0ID) => {
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
            Users = {this.state.Users}
            OpenNewMessage={(OpenOrClose) => this.OpenNewMessage(OpenOrClose)}
            auth={this.props.auth}
            HandleConversationClick={this.HandleConversationClick}
            UpdateConvoList={this.UpdateConvoList}
          />
        </div>

        <div className="scrollable content">
          <MessageList
            Users = {this.state.Users}
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

import React from "react";
import ConversationSearch from "./ConversationSearch/ConversationSearch";
import ConversationListItem from "./ConversationListItem/ConversationListItem";
import Toolbar from "./Toolbar";
//contains all the conversations that belongs to the landlord. One convo for each tenant
export default class ConversationList extends React.Component {
  state = {
    FilteredConversations: [ ],
    InitialConversations: [ ]
 
  };


 componentDidMount  = () => {
  window.DataLoaded = false
  this.setState({
    InitialConversations : this.props.Users
  })

 }
 
 static getDerivedStateFromProps =  (props,state ) => {
     
  if (window.DataLoaded === false ) { 
    window.DataLoaded = true
     return {FilteredConversations: props.Users,
    InitialConversations : props.Users
  }
}

  }

 
  //loads new conversation in the conversation window on the right
  HandleConversationClick = (name, FollowingAuth0ID) => {
    this.props.HandleConversationClick(name, FollowingAuth0ID);
  };

  //filters the list of people who are typed in the  search people search bar
  HandlePeopleSearch = (e) => {
    let conversations = this.state.InitialConversations;
    conversations = conversations.filter((conversation) => {
      return (
        conversation.FullName.toLowerCase().search(e.target.value.toLowerCase()) !==
        -1
      );
    });
    this.setState({
      FilteredConversations: conversations
    });
     
  };
  render() {
    return (
      <div className="conversation-list">
        <Toolbar OpenNewMessage={this.props.OpenNewMessage} title="Messenger" />
        <ConversationSearch HandlePeopleSearch={this.HandlePeopleSearch} />
        {this.state.FilteredConversations.length === 0 ? (
          <p> No conversations found </p>
        ) : (
          this.state.FilteredConversations.map((conversation) => (
            <ConversationListItem
               
              id={conversation.FollowingAuth0ID}
              data={conversation}
              HandleConversationClick={this.HandleConversationClick}
              ConvoSelected={this.props.ConvoSelected}
            />
          ))
        )}
      </div>
      
    );
  }
}

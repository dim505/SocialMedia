import React from "react";
import "./ConversationSearch.css";


//this is the search people search on top of the conversation list
export default function ConversationSearch(props) {
  const handleChange = e => {
    props.HandlePeopleSearch(e);
  };

  return (
    <div className="conversation-search">
      <input
        className="conversation-search-input"
        placeholder="Search People"
        onChange={handleChange}
      />
    </div>
  );
}

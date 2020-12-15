import React from "react";
import "./Toolbar.scss";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";


//
export default function Toolbar(props) {
  const { title, leftItems, rightItems } = props;
  return (
    <>
      <div className="MobileAddMessage">
        <IconButton onClick={() => props.OpenNewMessage(true)}>
          {" "}
          <AddCircleOutlineIcon />{" "}
        </IconButton>
      </div>
      <div id="ConversationToolBar" className="toolbar">
        <div className="left-items">{leftItems}</div>
        <h1 className="toolbar-title">{title}</h1>
        <div className="right-items">{rightItems}</div>
        <IconButton onClick={() => props.OpenNewMessage(true)}>
          {" "}
          <AddCircleOutlineIcon />{" "}
        </IconButton>
      </div>
    </>
  );
}

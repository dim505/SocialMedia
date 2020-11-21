import React, { Component } from "react";
import moment from "moment";
import "./Message.scss";
import AttachFileIcon from "@material-ui/icons/Attachment";

//this is the message comn
export default class Message extends Component {
  Message = () => {
    
    if (
      this.props.data.message.includes(
        "https://shellstorage123.blob.core.windows.net/socialmedia"
      )
    ) {
      var message = this.props.data.message.replace(
        `https://shellstorage123.blob.core.windows.net/socialmedia/${window.channelName}`,
        ""
      );

      return (
        <React.Fragment>
          {" "}
          <AttachFileIcon classes={{ root: "MessageAttachmentIcon" }} />
          <a href={this.props.data.message} download="bite maaa" >{message}</a>
        </React.Fragment>
      );
    } else {
      return this.props.data.message;
    }
  };

  render() {
    const friendlyTimestamp = moment(this.props.data.timestamp).format("LLLL");

    return (
      <div
        className={[
          "message",
          `${this.props.isMine ? "mine" : ""}`,
          `${this.props.startsSequence ? "start" : ""}`,
          `${this.props.endsSequence ? "end" : ""}`
        ].join(" ")}
      >
        {this.props.showTimestamp && (
          <div className="timestamp">{friendlyTimestamp}</div>
        )}

        <div className="bubble-container">
          <div className="bubble" title={friendlyTimestamp}>
            {this.Message()}
          </div>
        </div>
      </div>
    );
  }
}

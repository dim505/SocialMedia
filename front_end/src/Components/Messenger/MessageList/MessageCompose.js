import React, { Component } from "react";
import Chat from "twilio-chat";
import Toolbar from "../ConversationList/Toolbar";
import ToolbarButton from "../ConversationList/ToolbarButton";
import Message from "./Message/message";
import moment from "moment";
import Axios from "axios";
import SendIcon from "@material-ui/icons/Send";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./MessageList.scss";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import Picker from "emoji-picker-react";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import IconButton from "@material-ui/core/IconButton";
 

export default class MessageCompose extends Component {
    state= {
        anchorEl: ""

    }


    onEmojiClick = (event, emojiObject) => {
        document.getElementsByClassName("compose-input")[0].value =
          document.getElementsByClassName("compose-input")[0].value +
          emojiObject.emoji;
        this.setState({
          chosenEmoji: emojiObject
        });
      };

    
    ShowPicker = (event) => {
        this.setState({
          anchorEl: event.currentTarget
        });
      };
    
      //closes menu with options pertaining to comment
      ClosePostMenu = () => {
        this.setState({
          anchorEl: null
        });
      };


    render () {
            return (
                <div className="compose">
                <IconButton
                  onClick={() => {
                            this.props.ShowPhotoUpload()
                  }}
                >
                  <AttachFileIcon />
                </IconButton>
                <input
                  onKeyPress={(event) => this.props.handleOnKeyPress(event)}
                  type="text"
                  className="compose-input"
                  placeholder="Type a message"
                />
                <IconButton onClick={(event) => this.ShowPicker(event)}>
                  <EmojiEmotionsIcon />
                </IconButton>
                <IconButton onClick={() => this.props.UpdateMessage()}>
                  <SendIcon style={{ fontSize: 36 }} />
                </IconButton>

                <Menu
          classes={{
            list: "EmojiMenu",
            paper: "EmojiMenuPaper"
          }}
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.ClosePostMenu}
        >
          <Picker
            onEmojiClick={(event, emojiObject) =>
              this.onEmojiClick(event, emojiObject)
            }
          />
        </Menu>


              </div>


            )
        }
}
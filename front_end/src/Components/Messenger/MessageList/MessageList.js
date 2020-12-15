import React, { Component } from "react";
import Chat from "twilio-chat";
import { ApiCall } from "../../SharedComponents/ApiCall";
import Message from "./Message/message";
import moment from "moment";
import Axios from "axios";
import Context from "../../SharedComponents/context";
import LinearProgress from "@material-ui/core/LinearProgress";
import "./MessageList.scss";
import Fade from "react-reveal/Fade";
import Typography from "@material-ui/core/Typography";
import MessageListToolBar from "./MessageListToolBar";
import UploadPhoto from "./UploadPhoto";
import MessageCompose from "./MessageCompose"
//parent that contains all the messages for the selected conversation
export default class MessageList extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      ShowPicker: false,
      Messages: [],
      ShowLoader: false
    };
  }

  componentDidMount() {
     
    window.ApiCallAlreadyMade = false;
    window.MY_USER_ID = "";

    window.addEventListener("scroll", this.HandleScroll, true);
  }

  //closes the photo dropzone
  ClosePhotoUpload = (Filename) => {
    if (Filename == undefined) {
      this.setState({
        ShowPhotoUpload: false
      });
    } 
  };

  ShowPhotoUpload  = () => {
      this.setState({
        ShowPhotoUpload: true
      })
  }

	//gets more conversations when user scrolls up
  HandleScroll = async () => {
    var ChannelMessageCount = await this.channel.getMessagesCount();
    var index = ChannelMessageCount - this.state.Messages.length;

    var Element = document.getElementsByClassName("scrollable content");

    if (
      Element[0].scrollTop < 500 &&
      Element[0].scrollTop > 1 &&
      ChannelMessageCount >= this.state.Messages.length &&
      Math.abs(window.GetOldMessTimeStamp - new Date()) > 500
    ) {
      window.GetOlderMessages = true;
      window.GetOldMessTimeStamp = new Date();
      this.channel
        .getMessages(100, index)
        .then((messages) => this.LoadMessages(messages));
    }
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.HandleScroll, true);
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.ConvoSelected !== this.props.ConvoSelected && this.props.ConvoSelected !== "") {
      await this.CallLoader("open");
      this.GetChatData();
      this.renderMessages();
    }
  }

	//calls loader when the chat loads begins 
  CallLoader = async (action) => {
    if (action === "open") {
      await this.setState({
        ShowLoader: true,
        Messages: []
      });
    } else {
      await this.setState({
        ShowLoader: false
      });
    }
  };
  //this gets access token be to authenticated by the twillo servers

  async GetChatData() {
    window.ClickOpen = false;
    var Mydata = {};
    var GetToken = {
      device: "browser",
      LoggedInUserAuth0ID: this.props.Users[0].LoggedInUserAuth0ID,
      TokenType: "Chat"
    };
    Mydata.GetToken = GetToken;
    window.MY_USER_ID = this.props.Users[0].LoggedInUserAuth0ID;
    let result = await Axios.post(
      /*`https://cors-anywhere.herokuapp.com/*/`${process.env.REACT_APP_BackEndUrl}/api/Messenger/GetToken`,
      Mydata
    )
      .then(async (result) => this.setupChatClient(result))
      .catch(this.handleError );
  }

  //this functions set up twillo chat client and get data from twillo servers
  async setupChatClient(result) {
    var client = await Chat.create(result.data);

    if (this.props.FollowingAuth0ID > this.props.Users[0].LoggedInUserAuth0ID)
    {
      window.channelName =
      this.props.FollowingAuth0ID +
      "-" +
      this.props.Users[0].LoggedInUserAuth0ID;

    } else {

      window.channelName =
      this.props.Users[0].LoggedInUserAuth0ID +
      "-" +
      this.props.FollowingAuth0ID;


    }

    this.client = client;
    this.client
      .getChannelByUniqueName(window.channelName)
      .then((channel) => (this.channel = channel))

      .catch((error) => {
        if (error.body.code === 50300) {
          return this.client.createChannel({ uniqueName: window.channelName });
        } else {
          this.handleError(error);
        }
      })
      .then((channel) => {
        this.channel.join().catch(() => {});
        this.channel
          .getMessages(100)
          .then((messages) => this.LoadMessages(messages));
      })
      .then(() => {
        this.channel.on("messageAdded", (message) => {
          if (
            this.props.Users[0].LoggedInUserAuth0ID !==
              message.author &&
            window.PreviousMessageID !== message.state.index
          ) {
            window.PreviousMessageID = message.state.index;
            this.LoadMessages(message);
          }

           
        });

         
      })
      .catch(this.handleError);
  }

  //notifies user when it cant load chat data
  handleError = () => {
    this.context.OpenNoti("Chat failed to Load :C");
  };

	//gets called to update state and render messages on screen 
  LoadMessages = async (messages) => {
    var MessageArray = [];
     

    if (messages.items !== undefined) {
      messages.items.map((message) => {
        var MessageObj = {
          id: message.state.index,
          author: message.state.author,
          message: message.state.body,
          timestamp: message.state.dateUpdated
        };

        MessageArray.push(MessageObj);
      });
    } else {
      var MessageObj = {
        id: messages.state.index,
        author: messages.state.author,
        message: messages.state.body,
        timestamp: messages.state.dateUpdated
      };

      MessageArray.push(MessageObj);
    }

    await this.setState((prevState) => ({
      Messages:
        (prevState.Messages.length <= 0 && prevState.ShowLoader === true) ||
        window.GetOlderMessages === true
          ? [...MessageArray, ...prevState.Messages]
          : [...prevState.Messages, ...MessageArray]
    }));

    this.renderMessages();
    this.CallLoader();
    window.GetOldMessTimeStamp = new Date();
    window.GetOlderMessages = false;
    var ScrollDiv = document.getElementsByClassName("scrollable content")[0];
    ScrollDiv.scrollTop = ScrollDiv.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
  };

  //adds new message to message list

  //builds out message list from data
  renderMessages = () => {
    let i = 0;
    let messageCount = this.state.Messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = this.state.Messages[i - 1];
      let current = this.state.Messages[i];
      let next = this.state.Messages[i + 1];
      let isMine = current.author === window.MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }
       
      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  };


  //adds message to message list when enter is pressed
  handleOnKeyPress = (e) => {
     
    if (e.key === "Enter" && e.target.value !== "") {
      this.UpdateMessage();
    }
  };

  //updates the message list after the user hits enter to submit the message
  UpdateMessage = async (fileName) => {
   
    if (      this.state.Messages.length <= 0 &&
      this.props.FollowingAuth0ID !== undefined &&
      this.state.ShowLoader !== true) 
      {
        var MyData = {}
        ApiCall(
          "Post",
          `${process.env.REACT_APP_BackEndUrl}/api/Messenger/ChatStarted/${this.props.FollowingAuth0ID}`,
          MyData
        ).then(
                this.props.GetUsers()
        )

      }
    var Message = "";
    if (fileName !== undefined) {
      Message = fileName;
    } else {
      Message = document.getElementsByClassName("compose-input")[0].value;
    }

    this.channel.sendMessage(
      Message
    );
    document.getElementsByClassName("compose-input")[0].value = "";
    
    await this.setState((prevState) => ({
      Messages: [
        ...prevState.Messages,
        {
          id: this.state.Messages.length + 1,
          author: window.MY_USER_ID,
          message: Message,
          timestamp: new Date().getTime()
        }
      ]
    }));
    

    this.renderMessages();
    var ScrollDiv = document.getElementsByClassName("scrollable content")[0];
    ScrollDiv.scrollTop = ScrollDiv.scrollHeight;
  };

	//depending if a conversation is loaded, or if there is a conversation, it will load the correct message componenet
  ShowMessages = () => {
   

    if (
      this.state.Messages.length <= 0 &&
      this.props.FollowingAuth0ID !== undefined &&
      this.state.ShowLoader !== true
    ) {
      return (
        <React.Fragment>
          <div className="message-list-container">
            <Typography
              classes={{ root: "CenterText" }}
              variant="h3"
              gutterBottom
            >
              No conversations found. Type Away!!!
            </Typography>

            {this.renderMessages()}
          </div>

          
         <MessageCompose 
         handleOnKeyPress={this.handleOnKeyPress}
         UpdateMessage={this.UpdateMessage}
         ShowPhotoUpload = {this.ShowPhotoUpload}
         ClosePhotoUpload={this.ClosePhotoUpload}/>
        </React.Fragment>
      );
    } else if (this.props.FollowingAuth0ID !== undefined) {
      return (
        <React.Fragment>
          <div className="message-list-container">{this.renderMessages()}</div>    
          <MessageCompose 
          handleOnKeyPress={this.handleOnKeyPress}
         UpdateMessage={this.UpdateMessage}
         ShowPhotoUpload = {this.ShowPhotoUpload}
         ClosePhotoUpload={this.ClosePhotoUpload}/>
        </React.Fragment>
      );
    } else {
      return (
        <Typography classes={{ root: "CenterText" }} variant="h3" gutterBottom>
          Please select a consersation
        </Typography>
      );
    }
  };



  render() {
    return (
      <div className="message-list">
        <MessageListToolBar
          HandleConversationClick={this.props.HandleConversationClick}
          Users = {this.props.Users}
          OpenNewMessage={this.props.OpenNewMessage}
          ConvoSelected={this.props.ConvoSelected}
          FollowingAuth0ID = {this.props.FollowingAuth0ID}
        />
        <Fade top opposite when={this.state.ShowLoader}>
          <LinearProgress />
        </Fade>

        {this.ShowMessages()}



        <UploadPhoto
          UpdateMessage={this.UpdateMessage}
          FileTypeBeingUploaded={this.state.FileTypeBeingUploaded}
          ClosePhotoUpload={this.ClosePhotoUpload}
          ShowPhotoUpload={this.state.ShowPhotoUpload}
        />
      </div>
    );
  }
}

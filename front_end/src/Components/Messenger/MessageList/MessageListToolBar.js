import React from "react";
import Input from "@material-ui/core/Input";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import PhoneIcon from "@material-ui/icons/Phone";
import { Device } from 'twilio-client';
import CallEndIcon from '@material-ui/icons/CallEnd';
import Typography from '@material-ui/core/Typography';
import Fade from 'react-reveal/Fade';

export default class MessageListToolBar extends React.Component {
  state = {
    ContactName: "",
    ContactPersonSelected: "",
    CallingPerson:  null
  };

  componentDidMount = () => {

    this.GetVoiceToken()

  }

  GetVoiceToken = async () => {

      var Mydata = {};
      var GetToken = {
        device: "browser",
        LoggedInUserAuth0ID: this.props.Users[0].LoggedInUserAuth0ID
      };
      Mydata.GetToken = GetToken;
      window.MY_USER_ID = this.props.Users[0].LoggedInUserAuth0ID;
      let result = await Axios.post(
        /*`https://cors-anywhere.herokuapp.com/*/`${process.env.REACT_APP_BackEndUrl}/api/Messenger/GetToken`,
        Mydata
      )
        .then(async (result) => {
        var Token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2JmN2Q0MTU2Zjk4MzQxOTkzZTFlMmZmYThhNTE3MTVhLTE2MDY2NTAwMjEiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJ0aGVfdXNlcl9pZCIsInZvaWNlIjp7ImluY29taW5nIjp7ImFsbG93Ijp0cnVlfSwib3V0Z29pbmciOnsiYXBwbGljYXRpb25fc2lkIjoiQVA5NmNmMjVmYzI3NzY4NGUxMzE1YjAwNWYwMDJjY2U4YyJ9fX0sImlhdCI6MTYwNjY1MDAyMiwiZXhwIjoxNjA2NjUzNjIyLCJpc3MiOiJTS2JmN2Q0MTU2Zjk4MzQxOTkzZTFlMmZmYThhNTE3MTVhIiwic3ViIjoiQUMzNGE2MTZkMGM0ZWUwZWMyZmNiYjVlMWNlOWNmNWYxYyJ9.pNQof2tkELpDHmCuATpdsGMTXUOHwXKbLv4jLx4eyic";
          // Setup Twilio.Device
          window.device = new Device(Token, {
            // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
            // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
            codecPreferences: ["opus", "pcmu"],
            // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
            // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
            // a second time and sending the tone twice. This will be default in 2.0.
            fakeLocalDTMF: true,
            // Use `enableRingingState` to enable the device to emit the `ringing`
            // state. The TwiML backend also needs to have the attribute
            // `answerOnBridge` also set to true in the `Dial` verb. This option
            // changes the behavior of the SDK to consider a call `ringing` starting
            // from the connection to the TwiML backend to when the recipient of
            // the `Dial` verb answers.
            enableRingingState: true
          });
      
          window.device.on("ready", function (device) {
            console.log("Twilio.Device Ready!");
          });
        
        
        )
        .catch(this.handleError );
    

  }
  HandleChange = (event) => {
    this.setState({ ContactName: event.target.value });
  };

  CallFollower = () => {
      if  (window.device) {
            this.setState({CallingPerson: this.props.ConvoSelected})
            var OutgoingConnection = window.device.connect({To: "4134754431"})
            OutgoingConnection.on("ringing", () => {console.log("ringing")})
      }
  }

  EndCall = () => {
    console.log("Hanging up...");
    if (window.device) {
      this.setState({CallingPerson: null})
      window.device.disconnectAll();
    }

  }

  handleClickAway = () => {
    this.setState({ ContactName: "" });
  };

  SelectPerson = (FullName,FollowingAuth0ID) => {
    this.props.HandleConversationClick(FullName,FollowingAuth0ID)
    this.setState({
      ContactName: "",
      ContactPersonSelected: ""
    });
  };

  RenderInputclass = () => {
     
    if (this.state.ContactName === "") {
      return "ComeposeMessageInput";
    } else if (this.state.ContactName !== "") {
      return "ComeposeMessageInput ComeposeMessageInputType";
    }
  };

  RenderContacts = () => {

    var FilteredPerson = this.props.Users.filter(person => person.FullName.includes(this.state.ContactName))
    if (FilteredPerson.length >= 1) {
          return (
            FilteredPerson.map
            (FilteredPerson => (
                         
              <ListItem
               key={FilteredPerson.FollowingAuth0ID}
               button
               onClick={() => this.SelectPerson(FilteredPerson.FullName,FilteredPerson.FollowingAuth0ID)}
               >
               <ListItemIcon>
                 <Avatar src={FilteredPerson.ProfilePhotoUrl} />
               </ListItemIcon>

               <ListItemText primary={FilteredPerson.FullName} />
               </ListItem>  
         ))
    )
    } else {
        return (<p>Sorry no matches found</p>)

    }


    
  }

  render() {
    return (
      <>
        {this.props.OpenNewMessage ? (
          <div className="ComeposeMessage">
            <p>
              To:{" "}
              {this.state.ContactPersonSelected ? (
                <span className="SelectedPerson">
                  {" "}
                  {this.state.ContactPersonSelected}
                  <IconButton onClick={() => this.SelectPerson("")}>
                    <CancelIcon />
                  </IconButton>
                </span>
              ) : (
                <Input
                  value={this.state.ContactName}
                  onChange={(event) => {
                    this.HandleChange(event);
                  }}
                  placeholder="Type the name of the person"
                  classes={{
                    root: this.RenderInputclass()
                  }}
                  disableUnderline={true}
                />
              )}
            </p>
          </div>
        ) : (
          <div className="toolbar">
            <h1 className="toolbar-title">{this.props.ConvoSelected}</h1>
        {this.props.ConvoSelected === ""  ? 
         <div/> :
        <div className="RightAllgin">
              <IconButton onClick={this.CallFollower}>
                <PhoneIcon />
              </IconButton>
              <IconButton>
                <VideoCallIcon />
              </IconButton>
            </div>
          }  
          </div>
        )}
 
 

          {this.state.CallingPerson ? 
        
            <Paper classes={{root: "Calling"}}>
        <Typography variant="h5" gutterBottom>
        {this.state.CallingPerson}
          </Typography>
          <IconButton onClick={this.EndCall}>
          <CallEndIcon/>
          </IconButton>         
          
          </Paper>

       

            : <div/>
          }

        {Boolean(this.state.ContactName) ? (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <Paper
              elevation={3}
              classes={{
                root: "SearchContactDropDown"
              }}
            >
              <List>
                <div className="SeachContactHeader">CONTACTS </div>
                    {this.RenderContacts()}

              </List>
            </Paper>
          </ClickAwayListener>
        ) : (
          <div />
        )}
      </>
    );
  }
}

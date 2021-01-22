import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import PhoneIcon from "@material-ui/icons/Phone";
import { Device } from 'twilio-client';
import CallEndIcon from '@material-ui/icons/CallEnd';
import Typography from '@material-ui/core/Typography'; 
import Axios from 'axios';


export default class VoiceCalling extends Component  {
    state = {
      CallingPerson : ""

    }
    

  componentDidMount = () => {
    
  }

  componentDidUpdate = () => {
      if  (this.props.Users.length > 0 && !window.Token ) {
        this.GetVoiceToken()
      }
    
  }

      //gets voice token and set up voice device to be able to make/receive voip calls 
   GetVoiceToken = async () => {

    var Mydata = {};
    var GetToken = {
      device: "browser",
      LoggedInUserAuth0ID: this.props.Users[0].LoggedInUserAuth0ID.replace("|",""),
      TokenType: "Voice"
    };
      Mydata.GetToken = GetToken;
    window.MY_USER_ID = this.props.Users[0].LoggedInUserAuth0ID.replace("|","");
    let result = await Axios.post(
      /*`https://cors-anywhere.herokuapp.com/*/`${process.env.REACT_APP_BackEndUrl}/api/Messenger/GetToken`,
      Mydata
    )
      .then(async (result) => {
       window.Token = result.data
        // Setup Twilio.Device
        window.device = new Device(window.Token, {
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
    //let you know once the library is ready to call
        window.device.on("ready", function (device) {
          console.log("Twilio.Device Ready!");
        });
        //listen event for incoming calls
        window.device.on("incoming", (conn) => {
          debugger;
         console.log(conn)
         var CallingPersonName = this.props.Users.filter((user) => { return user.FollowingAuth0ID.replace("|","") ===  conn.parameters.From.replace("client:", "")})
         this.setState({
           IncomingCall: true,
          conn: conn,
          CallingPerson: /*conn.parameters.From  */CallingPersonName[0].FullName
        })
         
        window.device.on("connect", function(conn) {
          console.log("Successfully established call!");
     
        });

        });
    //listen event for errors
        window.device.on("error", (error) => {
          console.log(error);
        });
        //call back function for end a call ends 
        window.device.on("disconnect", () => {
          this.EndCall();
        });
      
        console.log(result)
      }      
      )
      .catch( (error  ) => console.log(error) );
  
    }









    //this function actually calls someone 
    CallFollower = (ConvoSelected,FollowingAuth0ID) => {
    if  (window.device) {
          this.setState({CallingPerson: ConvoSelected})
          var OutgoingConnection = window.device.connect({To: /*this.props.Users[0].LoggedInUserAuth0ID.replace("|","")*/ FollowingAuth0ID.replace("|","")})
          OutgoingConnection.on("ringing", () => {console.log("ringing")})
    }
}
  //function executes should a user want to pick up a call
  PickUpCall = () => {
  this.state.conn.accept();
  this.setState({
    IncomingCall: null

  })


};

  //THIS FUNCTION ENDS A CALL
  EndCall = () => {
  
  if (window.device) {
    window.device.disconnectAll();
    this.setState({
      IncomingCall: null,
      CallingPerson: null
    })
 
    console.log("Hanging up...");
  }

}
render () {
  return (
    <>
    {this.state.CallingPerson ? 
               <Paper classes={{ root: "Calling" }}>
               <Typography variant="h5" gutterBottom>
                 {this.state.CallingPerson}
               </Typography>
               {this.state.IncomingCall ? (
                 <IconButton onClick={this.PickUpCall}>
                   <PhoneIcon classes={{ root: "CallingPickUp" }} />
                 </IconButton>
               ) : (
                 <IconButton onClick={this.EndCall}>
                   <CallEndIcon classes={{ root: "CallingEndCall" }} />
                 </IconButton>
               )}
             </Paper>
        : 
        <div />

      }

    </>

)
}
}


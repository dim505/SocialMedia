import React, { useEffect, useState, useContext } from "react";
import VideoParticipant from "./VideoParticipant";
import Video from "twilio-video";
import Axios from "axios";
import Fade from "@material-ui/core/Fade";
import CallEndIcon from "@material-ui/icons/CallEnd";
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Context from "../../SharedComponents/context";

const VideoChatContainer = (props) => {
  const context = useContext(Context)
  const [participants, setParticipants] = useState([]);
  const [room, SetRoom] = useState(null);
  const [token, SetToken] = useState(null);

  const participantConnected = (participant) => {
    debugger;
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
    console.log("participant Connected: " + participant);
  };

  const participantDisconnected = (participant) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
    console.log("participant disconnected " + participant);
  };

  useEffect(() => {
    ConnectToRoom();
    return (room) => {
      console.log("VideoPartipantUnmounted");
    };
  }, []);

  const ConnectToRoom = () => {
    var channelName = ""
    if (window.FollowerAuth0ID > props.Users[0].LoggedInUserAuth0ID)
    {
      channelName =
      window.FollowerAuth0ID +
      "-" +
      props.Users[0].LoggedInUserAuth0ID;

    } else {
      channelName =
      props.Users[0].LoggedInUserAuth0ID +
      "-" +
      window.FollowerAuth0ID;
    }




    var GetToken = {
      device: "browser",
      LoggedInUserAuth0ID: props.Users[0].LoggedInUserAuth0ID,
      channelName: channelName,
      TokenType: "Video"
    };
    var Mydata = {} 
    Mydata.GetToken = GetToken;
    window.MY_USER_ID = props.Users[0].LoggedInUserAuth0ID;
    let result =  Axios.post(
      /*`https://cors-anywhere.herokuapp.com/*/`${process.env.REACT_APP_BackEndUrl}/api/Messenger/GetToken`,
      Mydata
    )
      .then(async (results) => {
    // Option 2
    Video.connect(results.data, {
      name: "my-room-name"
    }).then(
      async (room) => {
        debugger;
        await SetRoom(room);
        console.log("Connected to Room :", room.name);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
      },
      (error) => {
        context.OpenNoti("Error!!! Could not load Video Chat")
        props.CallVideoChat(false)
        console.error(error.message);
      }
    );

      })
  
    


  };

  return (
    <Fade in={props.ShowVideoChat}>
      <div className="VideoChatContainer">
        {room ? (
          <>
            <VideoParticipant
              className="LocalParticipant"
              participant={room.localParticipant}
            />


            {participants.length > 0 ? 
            
            
            participants.map((participant) => (
              <VideoParticipant
                className="RemoteParticipant"
                participant={participant}
              />
            )) : <div className="NoParticipant">
             <Typography variant="h4" gutterBottom>Waiting for Participant to join <CircularProgress classes={{root: "NoPartSpinner"}}/></Typography>
            </div>
          
          }

            <div className="EndVideoCall">
              <Button
                onClick={() => {
                  props.CallVideoChat(false);
                  room.disconnect();
                }}
                variant="contained"
                color="secondary"
              >
                <CallEndIcon />
              </Button>
            </div>
          </>
        ) : (
          <div />
        )}
      </div>
    </Fade>
  );
};

export default VideoChatContainer;

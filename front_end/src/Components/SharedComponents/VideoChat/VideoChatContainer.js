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

//CONTAINS THE OVERLAY FOR THE VIDEO CHAT WINDOW 
const VideoChatContainer = (props) => {
  const context = useContext(Context)
  //KEEPS TRACK OF REMOTE PARTICIPANTS 
  const [participants, setParticipants] = useState([]);
  //KEEPS TRACK OF THE ROOM 
  const [room, SetRoom] = useState(null);
   //KEEPS TRACK OF THE VIDEO TOKEN
  const [token, SetToken] = useState(null);

	//EXICUTES WHEN A REMOTE PARTICIPANT JOINS THE VIDEO CHAT 
	
  const participantConnected = (participant) => {
    debugger;
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
    console.log("participant Connected: " + participant);
  };

	//REMOVE PARTICIPANT FROM STATE WHEN THEY LEAVE THE VIDEO CHAT 
  const participantDisconnected = (participant) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
    console.log("participant disconnected " + participant);
  };

	//CONNECTS TO ROOM ON INTIAL LOAD 
	
  useEffect(() => {
    ConnectToRoom();
    return (room) => {
      console.log("VideoPartipantUnmounted");
    };
  }, []);

	//GETS TOKEN AND CONNECTS TO ROOM 
	
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
		//SETS ROOM STATE 
        await SetRoom(room);
        console.log("Connected to Room :", room.name);
			//EVENT LISTENER WHEN A REMOTE USER CONNECTS 
        room.on("participantConnected", participantConnected);
			//EVENT LISTENER WHEN A REMOTE USER CONNECTS 
        room.on("participantDisconnected", participantDisconnected);
			//ADDS PARTICIPANTS TO STATE TO PEOPLE WHO ARE ALREADY CONNECTED TO THE ROOM 
        room.participants.forEach(participantConnected);
      },
      (error) => {
		  //lets user know it could not load video 
        context.OpenNoti("Error!!! Could not load Video Chat")
		//closes out video modal 
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

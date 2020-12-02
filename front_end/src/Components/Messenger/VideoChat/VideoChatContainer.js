import React, { useEffect, useState } from "react";
import VideoParticipant from "./VideoParticipant";
import Video from "twilio-video";

import Fade from "@material-ui/core/Fade";
import CallEndIcon from "@material-ui/icons/CallEnd";
import Button from "@material-ui/core/Button";

const VideoChatContainer = (props) => {
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
    var token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzAwZmYzYzY4YTg2ZDlkNGJiNDJiMmQzYTllMzU2ZmI5LTE2MDY4MzI0NTMiLCJpc3MiOiJTSzAwZmYzYzY4YTg2ZDlkNGJiNDJiMmQzYTllMzU2ZmI5Iiwic3ViIjoiQUMzNGE2MTZkMGM0ZWUwZWMyZmNiYjVlMWNlOWNmNWYxYyIsImV4cCI6MTYwNjgzNjA1MywiZ3JhbnRzIjp7ImlkZW50aXR5IjoiMiIsInZpZGVvIjp7fX19.kQHOYIJpec2-2q9jU3_d5Drxdz1-JkVLv4jiOyFAhxg";

    // Option 2
    Video.connect(token, {
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
        console.error(error.message);
      }
    );
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

            {participants.map((participant) => (
              <VideoParticipant
                className="RemoteParticipant"
                participant={participant}
              />
            ))}

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

import React, { useState, useEffect, useRef } from "react";
//this represents the video screen of any one who joins the video chat 
const VideoParticipant = ({ className, participant }) => {
  
//sets state for component 
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setaudioTracks] = useState([]);
//get reference to audio and video html elements 
  const videoRef = useRef();
  const audioRef = useRef();

  
	//filters through and only extracts the relevant tracks 
  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  //add users tracks to state
  useEffect(() => {
    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else {
        setaudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

	//removes users tracks from state 
    const trackUnsubscribe = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else {
        setaudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };
    debugger;
	//sets the user tracks in state 
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setaudioTracks(trackpubsToTracks(participant.audioTracks));
	//runs trackSubscribed function when a participant joins 
  participant.on("trackSubscribed", trackSubscribed);
  //runs trackUnsubscribe function when a participant leaves 
    participant.on("trackUnsubscribe", trackUnsubscribe);

    return () => {
	 //unmounting does a bunch of clean up
      setVideoTracks([]);
      setaudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

	//attaches video track of participant to the video html element 
  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

//attaches audio track of participant to the audio html element 
  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className={className}>
      <video ref={videoRef} autoPlay={true} />
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </div>
  );
};

export default VideoParticipant;

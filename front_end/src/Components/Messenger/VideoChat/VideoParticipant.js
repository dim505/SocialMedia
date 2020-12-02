import React, { useState, useEffect, useRef } from "react";

const VideoParticipant = ({ className, participant }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setaudioTracks] = useState([]);

  const videoRef = useRef();
  const audioRef = useRef();

  //const trackpubsToTracks = trackMap = Array.from(trackMap.values()).map(publication => publication.track).filter(track => track !== null);

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  //functiions
  useEffect(() => {
    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else {
        setaudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribe = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else {
        setaudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };
    debugger;
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setaudioTracks(trackpubsToTracks(participant.audioTracks));
    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribe", trackUnsubscribe);

    return () => {
      setVideoTracks([]);
      setaudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

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

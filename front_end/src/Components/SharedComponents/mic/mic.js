import React, { Component } from "react";
import { VoicePlayer, VoiceRecognition } from "react-voice-components";
import mic from "./mic.gif";
import mic_animate from "./mic-animate.gif";

//this component displays the actual Mic 
export default class Mic extends Component {
  state = {
    StartMic: false
  };

	
  componentDidMount = () => {  
    if (this.props.class === "AddCommentMic") {
      document.getElementById(this.props.postGuid).style.opacity  = "100%"
    }
  };



	//sends transcripted text to parent to update textfield
  onResult  = (e)  => {
 
    this.props.HandleMicOutput(e.finalTranscript);
  };

	//starts the mic to record 
  StartMic = () => {
    this.setState({
      StartMic: !this.state.StartMic
    });
  };

	//only renders mic when browser is chrome 
  RenderMicComp = () => {
    if (
      !!window.chrome &&
      (!!window.chrome.webstore || !!window.chrome.runtime)
    ) {
      return (
        <React.Fragment>
           
          {this.state.StartMic ? (
            <React.Fragment>
              <img
                onClick={() => this.StartMic()}
                src={mic_animate}
                alt="mic"
              />
              <VoiceRecognition onResult={this.onResult} continuous={true} />
              </React.Fragment>
          ) : (
            <img
              id="MicImg"
              onClick={() => this.StartMic()}
              src={mic}
              alt="mic"
            />
          )}

          
        </React.Fragment>
      );
    } else {
      return <div />;
    }
  };

  render() {
    return <div
    id={this.props.postGuid}
    class={this.props.class}>{this.RenderMicComp()}</div>;
  }
}

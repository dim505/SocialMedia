import React, { Component } from "react";
import { VoicePlayer, VoiceRecognition } from "react-voice-components";
import mic from "./mic.gif";
import mic_animate from "./mic-animate.gif";

export default class Mic extends Component {
  state = {
    StartMic: false
  };

  componentDidMount = () => {};


  onResult  = (e)  => {
    debugger;
    this.props.HandleMicOutput(e.finalTranscript);
  };

  StartMic = () => {
    this.setState({
      StartMic: !this.state.StartMic
    });
  };

  RenderMicComp = () => {
    if (
      !!window.chrome &&
      (!!window.chrome.webstore || !!window.chrome.runtime)
    ) {
      return (
        <div class={this.props.class}>
          {this.state.StartMic ? (
            <div class={this.props.class}>
              <img
                onClick={() => this.StartMic()}
                src={mic_animate}
                alt="mic"
              />
              <VoiceRecognition onResult={this.onResult} continuous={true} />
            </div>
          ) : (
            <img
              class={this.props.class}
              onClick={() => this.StartMic()}
              src={mic}
              alt="mic"
            />
          )}
        </div>
      );
    } else {
      return <div />;
    }
  };

  render() {
    return <div class={this.props.class}>{this.RenderMicComp()}</div>;
  }
}

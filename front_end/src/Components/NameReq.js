import React, { Component } from "react";
import ProQckStatsEditProDiag from "./SharedComponents/EditProfileModal/ProQckStatsEditProDiag";
import Paper from "@material-ui/core/Paper";
import Context from "./SharedComponents/context";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ReactDOM from "react-dom";

export default class NameReq extends Component {
  static contextType = Context;
  state = {
    OpenDialog: false,
  };

  componentDidMount = () => {
    this.ShouldOpenProfileEdit();
  };

  ShouldOpenProfileEdit = () => {
    if (
      this.props.AccountInfo[0].fullName === "" &&
      this.state.OpenDialog !== true &&
      this.context.ShowLoader === false
    ) {
      this.context.OpenNoti(
        "Please Enter Your Name and Click UPDATE INFO Before Proceeding"
      
      );
      this.OpenDialog();

    } else if (
      this.props.AccountInfo[0].fullName !== "" &&
      this.state.OpenDialog === true
    ) {
      this.CloseDialog();
      this.context.CloseNoti();
    }
  };
  componentDidUpdate(prevProps) {
    this.ShouldOpenProfileEdit();
  }

  OpenDialog = () => {
    this.setState({
      OpenDialog: true,
    });
  };

  CloseDialog = () => {
    this.setState({
      OpenDialog: false,
    });
  };

  render() {
    return (
      <div className="ProfileEditModal">
        <ProQckStatsEditProDiag
          OpenNoti2={() => this.context.OpenNoti()}
          OpenDialog={this.state.OpenDialog}
          CloseDialog2={this.CloseDialog}
        />
      </div>
    );
  }
}

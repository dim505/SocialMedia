import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link } from "react-router-dom";
import FindPeopleParent from "./FindPeople/FindPeopleParent";
import FollowingPeopleParent from "./FollowingPeople/FollowingPeopleParent";
import Followers from "./Followers/Followers";
export default class PeoplePage extends Component {
  state = { value: 1 };

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };

  RenderSubPage = () => {
    if (this.state.value === 0) {
      return <FindPeopleParent />;
    }
    if (this.state.value === 1) {
      return <FollowingPeopleParent />;
    } else {
      return <Followers />;
    }
  };

  render() {
    return (
      <div>
        <Paper>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Find People"></Tab>
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>
        </Paper>

        {this.RenderSubPage()}
      </div>
    );
  }
}

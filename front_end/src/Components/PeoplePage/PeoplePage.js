import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link } from "react-router-dom";
import FindPeopleParent from "./FindPeople/FindPeopleParent";
import FollowingPeopleParent from "./FollowingPeople/FollowingPeopleParent";
import Followers from "./Followers/Followers";
import "./people.scss";
import { ApiCall } from "../SharedComponents/ApiCall";


//component contains all the components for the People page
export default class PeoplePage extends Component {
  state = { value: 1, FindPeople: [], Followers: [], Following: [] };

  componentDidMount() {
    this.GetData();
  }

  //keeps track of which tab is being selected
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    });
  };

  GetData = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/People/FindPeople`
    ).then((results) => {
      this.setState({
        FindPeople: results,
      });
    });

    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/People/GetFollowers`
    ).then((results) => {
      this.setState({
        Followers: results,
      });
    });

    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/People/GetFollowing`
    ).then((results) => {
      this.setState({
        Following: results,
      });
    });
  };

  //depending on the tab selected. It will render a different component
  RenderSubPage = () => {
    if (this.state.value === 0) {
      return (
        <FindPeopleParent
          GetData={() => this.GetData()}
          FindPeople={this.state.FindPeople}
        />
      );
    }
    if (this.state.value === 1) {
      return (
        <FollowingPeopleParent
          GetData={() => this.GetData()}
          Following={this.state.Following}
        />
      );
    } else {
      return <Followers 
      GetData={() => this.GetData()}
      Followers={this.state.Followers} />;
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

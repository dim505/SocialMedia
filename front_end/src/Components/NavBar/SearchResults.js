import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import NoSeachResultsFound from "./NoSeachResultsFound";
import { ApiCall } from "../SharedComponents/ApiCall";
import Grid from "@material-ui/core/Grid";
import PostParent from "../MainPage/Post/PostParent";
import ProfileCardFollow from "../SharedComponents/ProfileCardFollow"
import { withRouter } from "react-router-dom";


//this displays the various search results from the search bar in the nav bar
class SearchResults extends Component {
  state = {
    value: 0,
    SearchTerm: "",
    PostSeachResults: [],
    UserSeachResults: []
  };

  componentDidMount = () => {
  this.setState({
	value: window.SearchTabValue
  })
    this.GetData();
	//listens for page pages and gets data if page is search results 
    this.unlisten = this.props.history.listen((location, action) => {
      
      if (location.pathname === "/SearchResults") {
        this.GetData();
      }
    });
  };

	//kills event listener 
  componentWillUnmount() {
      this.unlisten();
  }



	//makes api call to get data 
  GetData = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/Home/Search/Posts/${window.SearchTerm}`
    ).then((results) => {
      this.setState({
        PostSeachResults: results
      });
    });

    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/Home/Search/Users/${window.SearchTerm}`
    ).then((results) => {
      this.setState({
        UserSeachResults: results
      });
    }); 
  };

	//keeps value of the selected tab in the header
  handleChange = (event, newValue) => {
    this.setState({
      value: newValue
    });
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
            <Tab label="POSTS" />
            <Tab label="PEOPLE" />
          </Tabs>
        </Paper>
		<Grid container>
        { 
          this.state.value === 0 ? (
            this.state.PostSeachResults.length === 0 ? (
              <NoSeachResultsFound value={this.state.value} />
            ) : (
              this.state.PostSeachResults.map((post) => (
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <PostParent post={post} />
                </Grid>
              ))
            )
          ) : this.state.UserSeachResults.length === 0 ? (
            <NoSeachResultsFound value={this.state.value} />
          ) : (
            this.state.UserSeachResults.map((Person) => (
              <Grid item lg={4} md={4} sm={6} xs={12}>
				<ProfileCardFollow
				  GetData={() => this.GetData()}
                  Person={Person}
                />
              </Grid>
            ))
          )
 }
		
		
		</Grid>
      </div>
    );
  }
}

export default withRouter(SearchResults)

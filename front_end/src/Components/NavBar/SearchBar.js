import React, { Component } from "react";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import PeopleIcon from "@material-ui/icons/People";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
 
  withRouter 
 
} from "react-router-dom";
import SearchResults from "./SearchResults"

//this contains  the search bar in the nav bar
class SearchBar extends Component {
  state = {
    SearchTerm: "",
    SearchBarAnchorEl: null,
  };

  //keeps track of whats being typed in the search bar
  HandleChange = async (event) => {
    await this.setState({
      SearchTerm: event.target.value,
    });

    if (this.state.SearchTerm !== "" && this.state.SearchBarAnchorEl === null) {
      this.setState({
        SearchBarAnchorEl: document.getElementsByClassName("search")[0],
      });
    }
  };

  OpenSearchPopOver = (event) => {};
  //closes the suggestions popover
  CloseSearchPopOver = (event) => {
    this.setState({
      SearchBarAnchorEl: null,
    });
  };

  //this the suggestions pop over when a user clicks away
  handleClickAway = () => {
    this.setState({
      SearchTerm: "",
      SearchBarAnchorEl: null,
    });
  };

  
	//initiates the search to get the data 
	SearchSubmit = (SearchItem) => {
		window.SearchTerm = this.state.SearchTerm
	if (SearchItem === 'Users') {
		window.SearchTabValue = 1
		
	} else if (SearchItem === 'Posts') {
		window.SearchTabValue = 0
	}
    const { history } = this.props;
     
    history.push('/SearchResults') 
	}


  render() {
    return (
      <div className="SearchBarContainer">
        <div
          onClick={(event) => {
            this.OpenSearchPopOver(event);
          }}
          className="search"
        >
          <div className="SearchIconContainer">
            <SearchIcon
              classes={{
                root: "SearchIcon",
              }}
            />
          </div>
          <InputBase
            classes={{
              root: "SearchInputBase",
            }}
            value={this.state.SearchTerm}
            fullwidth={true}
            onChange={(event) => {
              this.HandleChange(event);
            }}
            id="SeachField"
            placeholder="Start typing to find your favorite posts and people...."
            inputProps={{ "aria-label": "search" }}
          />
        </div>
        {Boolean(this.state.SearchTerm) ? (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <Paper
              classes={{
                root: "SearchBarDropDown",
              }}
            >
              <List>
                <ListItem button
				onClick={() => this.SearchSubmit("Posts")}
				>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      "Search in posts for '" + this.state.SearchTerm + "' "
                    }
                  />
                </ListItem>

                <ListItem
                  button
                   onClick={() => this.SearchSubmit("Users")}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      "Search in users for '" + this.state.SearchTerm + "' "
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </ClickAwayListener>
        ) : (
          <div />
        )}
      </div>
    );
  }
  ;
}

export default withRouter(SearchBar);


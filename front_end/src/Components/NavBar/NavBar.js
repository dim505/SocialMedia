import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InputBase from "@material-ui/core/InputBase";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PeopleIcon from "@material-ui/icons/People";
import Slide from "@material-ui/core/Slide";

export default class NavBar extends Component {
  state = { OpenDrawer: false, ShowPage: "Home" };

  OpenDrawer = () => {
    this.setState({
      OpenDrawer: !this.state.OpenDrawer,
    });
  };

  CloseDrawer = () => {
    this.setState({
      OpenDrawer: !this.state.OpenDrawer,
    });
  };

  HandleMenuClick = (ShowPage) => {
    this.setState({
      ShowPage: ShowPage,
    });
  };
  render() {
    return (
      <div>
        <Drawer
          variant="permanent"
          classes={{
            paper: this.state.OpenDrawer ? "DrawerStyle" : "DrawerStyleClosed",
          }}
          anchor="left"
          open={this.state.OpenDrawer}
        >
          <div>
            <IconButton classes={{ root: "CloseDrawerIcon" }}>
              <ChevronLeftIcon onClick={this.CloseDrawer} />
            </IconButton>
          </div>
          <Divider />

          <List>
            <ListItem button onClick={() => this.HandleMenuClick("Home")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>

              <ListItemText primary="Home" />
            </ListItem>

            <ListItem button onClick={() => this.HandleMenuClick("Profile")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>

              <ListItemText primary="Profile" />
            </ListItem>

            <ListItem button onClick={() => this.HandleMenuClick("People")}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>

              <ListItemText primary="People" />
            </ListItem>
          </List>
        </Drawer>
        <AppBar
          position="fixed"
          classes={{
            positionFixed: "AppBarStyle",
            root: this.state.OpenDrawer ? "appBarShift" : "appBarClosed",
          }}
        >
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon onClick={this.OpenDrawer} />
            </IconButton>

            <Typography variant="h6" color="inherit">
              {" "}
              {this.state.ShowPage}
            </Typography>
            <div className="search">
              <div className="SearchIconContainer">
                <SearchIcon
                  classes={{
                    root: "SearchIcon",
                  }}
                />
              </div>
              <InputBase
                placeholder="Find posts and people...."
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

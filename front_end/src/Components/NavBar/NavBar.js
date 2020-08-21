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
import ProQckStatsEditProDiag from "../SharedComponents/EditProfileModal/ProQckStatsEditProDiag";
import { NavLink } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Popover from "@material-ui/core/Popover";
import SearchBar from "./SearchBar";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";

export default class NavBar extends Component {
  state = {
    OpenDrawer: false,
    ShowPage: "Home",
    PopOverAnchorEl: null,
    SearchBarAnchorEl: null,
    OpenDialog: false,
    OpenSearchBarDropdown: false,
    SearchTerm: "",
  };

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

  OpenPopOver = (event) => {
    this.setState({
      PopOverAnchorEl: event.currentTarget,
    });
  };

  ClosePopOver = (event) => {
    this.setState({
      PopOverAnchorEl: null,
    });
  };

  OpenNotiPopOver = (event) => {
    this.setState({
      PopOverNotiAnchorEl: event.currentTarget,
    });
  };

  CloseNotiPopOver = (event) => {
    this.setState({
      PopOverNotiAnchorEl: null,
    });
  };

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
            <NavLink exact={true} className="navbar__link" to="/">
              <ListItem
                classes={{
                  root: this.state.ShowPage === "Home" ? "ActivePage" : "",
                }}
                button
                onClick={() => this.HandleMenuClick("Home")}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>

                <ListItemText primary="Home" />
              </ListItem>
            </NavLink>

            <NavLink
              className="navbar__link"
              activeClassName="navbar__link--active"
              to="/Profile"
            >
              <ListItem
                classes={{
                  root: this.state.ShowPage === "Profile" ? "ActivePage" : "",
                }}
                button
                onClick={() => this.HandleMenuClick("Profile")}
              >
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>

                <ListItemText primary="Profile" />
              </ListItem>
            </NavLink>

            <NavLink
              className="navbar__link"
              activeClassName="navbar__link--active"
              to="/People"
            >
              <ListItem
                classes={{
                  root: this.state.ShowPage === "People" ? "ActivePage" : "",
                }}
                button
                onClick={() => this.HandleMenuClick("People")}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>

                <ListItemText primary="People" />
              </ListItem>
            </NavLink>
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

            <SearchBar />
            <div className={"NavIconsRight"}>
              <div>
                <IconButton
                  onClick={(event) => {
                    this.OpenNotiPopOver(event);
                  }}
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                  <NotificationsNoneIcon fontSize="default" />
                </IconButton>

                <IconButton
                  onClick={(event) => {
                    this.OpenPopOver(event);
                  }}
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </IconButton>
                {/*Avatar pop over menu for nav bars*/}
                <Popover
                  onClose={this.ClosePopOver}
                  open={Boolean(this.state.PopOverAnchorEl)}
                  anchorEl={this.state.PopOverAnchorEl}
                >
                  <List>
                    <ListItem button onClick={() => this.OpenDialog()}>
                      <ListItemText primary="My Account" />
                    </ListItem>

                    <ListItem
                      button
                      // onClick={() => this.HandleMenuClick("Profile")}
                    >
                      <ListItemText primary="Log Out" />
                    </ListItem>
                  </List>
                </Popover>
                {/*Notifications pop over menu */}
                <Popover
                  classes={{
                    paper: "NavNotiPopOver",
                  }}
                  onClose={this.CloseNotiPopOver}
                  open={Boolean(this.state.PopOverNotiAnchorEl)}
                  anchorEl={this.state.PopOverNotiAnchorEl}
                >
                  <div className="NotiContent">All Caught Up! </div>
                </Popover>
              </div>
            </div>
          </Toolbar>
        </AppBar>

        <ProQckStatsEditProDiag
          OpenDialog={this.state.OpenDialog}
          CloseDialog={this.CloseDialog}
        />
      </div>
    );
  }
}

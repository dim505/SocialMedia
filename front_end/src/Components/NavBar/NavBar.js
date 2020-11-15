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
import Tooltip from "@material-ui/core/Tooltip";
import "./Navbar.css";
import NotificationActivity from "./NotificationActivity";
import Context from "../SharedComponents/context";
import NavNotiPopOver from "./NavNotiPopOver"
import { ApiCall } from "../SharedComponents/ApiCall";
import Badge from '@material-ui/core/Badge';
import MessageIcon from '@material-ui/icons/Message';


//component goes at top of page, contains search  bar, drawer, log in button ect. top level compoent for the nav bar
export default class NavBar extends Component {
  static contextType = Context;

  state = {
    OpenDrawer: false,
    ShowPage: "Home",
    PopOverAnchorEl: null,
    SearchBarAnchorEl: null,
    OpenDialog: false,
    OpenSearchBarDropdown: false,
    SearchTerm: "",
	Messages: []
  };
  
   componentDidMount = () => {
	this.GetNotifications();

 }

 GetNotifications = () => {
        ApiCall(
          "Get",
          `${process.env.REACT_APP_BackEndUrl}/api/home/GetNotifications`
        ).then((results) => {
          this.setState({
            Messages: results,
          });
        });
 }
 
 

  //this function open nav drawer to see page names
  OpenDrawer = () => {
    this.setState({
      OpenDrawer: !this.state.OpenDrawer,
    });
  };
  //this function closes nav drawer to see page names
  CloseDrawer = () => {
    this.setState({
      OpenDrawer: !this.state.OpenDrawer,
    });
  };

  //handles the clicks from the nav drawer. Shows what page the user clicked
  HandleMenuClick = (ShowPage) => {
    this.setState({
      ShowPage: ShowPage,
    });
  };

  //handles button click on profile picture to display the the menu pop over
  OpenPopOver = (event) => {
    this.setState({
      PopOverAnchorEl: event.currentTarget,
    });
  };

  //closes the menu pop over for the menu that hangs over  the profile picture
  ClosePopOver = (event) => {
    this.setState({
      PopOverAnchorEl: null,
    });
  };

  //opens the Notifications pop over menu
  OpenNotiPopOver = (event) => {
    this.setState({
      PopOverNotiAnchorEl: event.currentTarget,
    });
  };
  //closes the Notifications pop over menu
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

  //logs user out of application
  Logout = () => {
    this.props.auth.logout({
      returnTo: `${process.env.REACT_APP_FrontEndSiteURL}`,
    });
  };
  render() {
    return (
      <div>
        <Drawer
          id="NavBarDrawer"
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
                  <Tooltip title="Home">
                    <HomeIcon />
                  </Tooltip>
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
                  <Tooltip title="Profile">
                    <AccountCircleIcon />
                  </Tooltip>
                </ListItemIcon>

                <ListItemText primary="Profile" />
              </ListItem>
            </NavLink>


            <NavLink
              className="navbar__link"
              activeClassName="navbar__link--active"
              to="/Messenger"
            >
              <ListItem
                classes={{
                  root: this.state.ShowPage === "Messenger" ? "ActivePage" : "",
                }}
                button
                onClick={() => this.HandleMenuClick("Messenger")}
              >
                <ListItemIcon>
                  <Tooltip title="Messenger">
                  <MessageIcon />
                  </Tooltip>
                </ListItemIcon>

                <ListItemText primary="Messenger" />
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
                <Tooltip title="People">
                  <ListItemText primary="People" />
                </Tooltip>
              </ListItem>
            </NavLink>
          </List>
        </Drawer>
        <AppBar
         id="NavBar"
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
			                  <Badge
                    color="secondary"
                    badgeContent={this.state.Messages.length}
                  >

                  <NotificationsNoneIcon fontSize="default" />
               </Badge>

 </IconButton>

                <IconButton
                  onClick={(event) => {
                    this.OpenPopOver(event);
                  }}
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                  <Avatar
                    alt={this.context.AccountInfo[0].fullName}
                    src={this.context.AccountInfo[0].profilePhotoUrl}
                  />
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

                    <ListItem button onClick={() => this.Logout()}>
                      <ListItemText primary="Log Out" />
                    </ListItem>
                  </List>
                </Popover>
                {/*Notifications pop over menu */}
					<NavNotiPopOver
							GetNotifications = {() => this.GetNotifications()}
							Messages = {this.state.Messages}
							CloseNotiPopOver = {() => this.CloseNotiPopOver()}
							PopOverNotiAnchorEl = {this.state.PopOverNotiAnchorEl}
					/>
				

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

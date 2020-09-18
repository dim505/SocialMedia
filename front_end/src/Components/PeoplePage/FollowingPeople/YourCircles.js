import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import ProfilePic from "../../download.jpg";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
//shows a list of the people you are following 
export default class YourCircles extends Component {
  state = {
    OpenList: false,
  };

  render() {
    return (
      <div>
        <div className="ProfileTitle"> Your Circles </div>

        <List
          classes={{
            root: "YourCircle",
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItem
            button
            onClick={() => {
              this.setState({
                OpenList: !this.state.OpenList,
              });
            }}
          >
            <ListItemIcon>
              <GroupWorkIcon />
            </ListItemIcon>
            <ListItemText primary="Following" />
          </ListItem>
          <Collapse in={this.state.OpenList} timeout="auto" unmountOnExit>
            <List
              classes={{
                root: "YourCircleItem",
              }}
              component="div"
              disablePadding
            >
              <ListItem button>
                <ListItemIcon>
                  <Avatar alt="Remy Sharp" src={ProfilePic} />
                </ListItemIcon>
                <ListItemText primary="Timmy BoB Smith Junior" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </div>
    );
  }
}

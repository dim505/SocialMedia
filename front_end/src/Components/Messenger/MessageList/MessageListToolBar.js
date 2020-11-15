import React from "react";
import Input from "@material-ui/core/Input";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import PhoneIcon from "@material-ui/icons/Phone";
export default class MessageListToolBar extends React.Component {
  state = {
    ContactName: "",
    ContactPersonSelected: "",
    SuggestedPeople: [
      {
        FullName: "bobSmith",
        ProfilePicture:
          "https://i.pinimg.com/280x280_RS/77/4a/d6/774ad65e34b5161c8f448980b5756d3d.jpg"
      },

      {
        FullName: "Nein Nine Nein",
        ProfilePicture:
          "https://i.pinimg.com/280x280_RS/77/4a/d6/774ad65e34b5161c8f448980b5756d3d.jpg"
      }
    ]
  };

  HandleChange = (event) => {
    this.setState({ ContactName: event.target.value });
  };

  handleClickAway = () => {
    this.setState({ ContactName: "" });
  };

  SelectPerson = (FullName) => {
    this.setState({
      ContactName: "",
      ContactPersonSelected: FullName
    });
  };

  RenderInputclass = () => {
     
    if (this.state.ContactName === "") {
      return "ComeposeMessageInput";
    } else if (this.state.ContactName !== "") {
      return "ComeposeMessageInput ComeposeMessageInputType";
    }
  };

  render() {
    return (
      <>
        {this.props.OpenNewMessage ? (
          <div className="ComeposeMessage">
            <p>
              To:{" "}
              {this.state.ContactPersonSelected ? (
                <span className="SelectedPerson">
                  {" "}
                  {this.state.ContactPersonSelected}
                  <IconButton onClick={() => this.SelectPerson("")}>
                    <CancelIcon />
                  </IconButton>
                </span>
              ) : (
                <Input
                  value={this.state.ContactName}
                  onChange={(event) => {
                    this.HandleChange(event);
                  }}
                  placeholder="Type the name of the person"
                  classes={{
                    root: this.RenderInputclass()
                  }}
                  disableUnderline={true}
                />
              )}
            </p>
          </div>
        ) : (
          <div className="toolbar">
            <h1 className="toolbar-title">{this.props.ConvoSelected}</h1>
            <div className="RightAllgin">
              <IconButton>
                <PhoneIcon />
              </IconButton>
              <IconButton>
                <VideoCallIcon />
              </IconButton>
            </div>
          </div>
        )}
        {Boolean(this.state.ContactName) ? (
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <Paper
              elevation={3}
              classes={{
                root: "SearchContactDropDown"
              }}
            >
              <List>
                <div className="SeachContactHeader">CONTACTS </div>

                {this.state.SuggestedPeople.map((person) => (
                  <>
                    <ListItem
                      button
                      onClick={() => this.SelectPerson(person.FullName)}
                    >
                      <ListItemIcon>
                        <Avatar src={person.ProfilePicture} />
                      </ListItemIcon>

                      <ListItemText primary={person.FullName} />
                    </ListItem>
                  </>
                ))}
              </List>
            </Paper>
          </ClickAwayListener>
        ) : (
          <div />
        )}
      </>
    );
  }
}

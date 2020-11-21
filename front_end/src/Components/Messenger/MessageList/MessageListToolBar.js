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
    ContactPersonSelected: ""
  };

  HandleChange = (event) => {
    this.setState({ ContactName: event.target.value });
  };

  handleClickAway = () => {
    this.setState({ ContactName: "" });
  };

  SelectPerson = (FullName,FollowingAuth0ID) => {
    this.props.HandleConversationClick(FullName,FollowingAuth0ID)
    this.setState({
      ContactName: "",
      ContactPersonSelected: ""
    });
  };

  RenderInputclass = () => {
     
    if (this.state.ContactName === "") {
      return "ComeposeMessageInput";
    } else if (this.state.ContactName !== "") {
      return "ComeposeMessageInput ComeposeMessageInputType";
    }
  };

  RenderContacts = () => {


    console.log(this.props.Users.filter(person => person.FullName.includes(this.state.ContactName)))

    var FilteredPerson = this.props.Users.filter(person => person.FullName.includes(this.state.ContactName))
    if (FilteredPerson.length >= 1) {
          return (
            FilteredPerson.map
            (FilteredPerson => (
                         
              <ListItem
               key={FilteredPerson.FollowingAuth0ID}
               button
               onClick={() => this.SelectPerson(FilteredPerson.FullName,FilteredPerson.FollowingAuth0ID)}
               >
               <ListItemIcon>
                 <Avatar src={FilteredPerson.ProfilePhotoUrl} />
               </ListItemIcon>

               <ListItemText primary={FilteredPerson.FullName} />
               </ListItem>  
         ))
    )
    } else {
        return (<p>Sorry no matches found</p>)

    }


    
  }

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
        {this.props.ConvoSelected === ""  ? 
         <div/> :
        <div className="RightAllgin">
              <IconButton>
                <PhoneIcon />
              </IconButton>
              <IconButton>
                <VideoCallIcon />
              </IconButton>
            </div>
          }  
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
                    {this.RenderContacts()}

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

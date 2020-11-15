import React, { Component } from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import { ApiCall } from "../../../SharedComponents/ApiCall";
import moment from "moment";
import Context from "../../../SharedComponents/context";
import { uuidv4 } from "../../../SharedComponents/SharedFunctions";
import Mic from "../../../SharedComponents/mic/mic";
import Fade from 'react-reveal/Fade';

//component/form used to add a commment to a post 
export default class AddPostComment extends Component {
  static contextType = Context;

  state = {
    AddPostCommentVal: "",
  };

	//keeps track of changes in textbox
  onChange = (newState) => {
    this.setState(newState);
  };

	//submits comment values 
  Submit = () => {
    var MyData = {};
    MyData.AddComment = {
      PostGuid: this.props.post.postGuid,
      CommentContent: this.state.AddPostCommentVal,
      DateCreated: moment().format("LL"),
      CommentGuid: uuidv4(),
    };

    ApiCall(
      "Post",
      `${process.env.REACT_APP_BackEndUrl}/api/home/AddComment`,
      MyData
    ).then(() => {
      this.props.HandleAddCommentClick();
      this.context.OpenNoti("Comment was Added");
    });
  };

  HandleMicOutput = (MicOutput) => {
    
    this.setState({
      AddPostCommentVal: this.state.AddPostCommentVal.concat(MicOutput)
    });
  };


  render() {
    return (
      <div>
        <CardHeader
          avatar={<Avatar
            alt={this.context.AccountInfo[0].fullName}
            src={this.context.AccountInfo[0].profilePhotoUrl}
          >
            
          </Avatar>}
          classes={{
            root: "TextAllignLeft",
          }}
          title={<div>
          
            <InputBase
              multiline={true}
              onChange={(event) =>
                this.onChange({ AddPostCommentVal: event.target.value })
              }
              value={this.state.AddPostCommentVal}
              classes={{ root: "AddPostInput" }}
              placeholder="Add a comment"
              inputProps={{ "aria-label": "search" }}
            />
        
              <Mic
                postGuid = {this.props.post.postGuid}
                HandleMicOutput={(MicOutput) => this.HandleMicOutput(MicOutput)}
                class="AddCommentMic"
              />
           
            </div>
          }
        />

        <CardActions disableSpacing>
          <div className="PostIconStyle">
            <Button
              disabled={Boolean(!this.state.AddPostCommentVal)}
              onClick={this.Submit}
            >
              POST
            </Button>
          </div>
        </CardActions>
      </div>
    );
  }
}

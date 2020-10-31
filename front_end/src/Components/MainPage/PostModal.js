import React, { Component } from "react";
import Axios from 'axios';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { ApiCall } from "../SharedComponents/ApiCall";
import moment from "moment";
import { uuidv4 } from "../SharedComponents/SharedFunctions";
import Context from "../SharedComponents/context";
import IconButton from "@material-ui/core/IconButton";
import VideocamIcon from "@material-ui/icons/Videocam";
import ImageIcon from "@material-ui/icons/Image";
import Fade from "react-reveal/Fade";
import { DropzoneArea } from "material-ui-dropzone";
import LinearProgress from "@material-ui/core/LinearProgress";

//component loads the first add post or edit post modal
export default class PostModal extends Component {
  static contextType = Context;
  state = {     Post: "",
  UploadFile: false,
  FileUploaded: null,
  ShowLoader: false,
  FileType: "",
  SupportedFileTypes: ""
};

  componentDidMount = () => {
    if (this.props.ModalType === "Edit") {
      this.setState({
        Post: this.props.post.postContent,
      });
    }
  };

  //submits the post information to the appropriate end point
  SubmitPost = async () => {
    this.setState({
      ShowLoader: true
    });

    if (this.props.ModalType === "Edit") {
      var MyData = {};
      var PostGuid = uuidv4();
      MyData.UpdatePostData = {
        PostGuid: this.props.post.postGuid,
        PostContent: this.state.Post,
        DateCreated: this.props.post.dateCreated,
      };
      

      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/home/UpdatePost/UpdatePost`,
        MyData
      ).then(() => {
        this.props.CloseModal();
        this.context.GetMainPagePosts();
        this.context.GetProfilePagePosts();
        this.context.OpenNoti("Post was Updated");
      });
    } else {
      var MyData = {};
      var PostGuid  = uuidv4()
      var FileUrl = ""
      var TempTagList = "";
      
      if (this.state.FileUploaded !== null) {
        var ext = this.state.FileUploaded[0].name.split(".").pop();
         var Filename =  PostGuid + uuidv4()  + "." + ext;
         window.containerClient = window.blobServiceClient.getContainerClient(
          "socialmedia"
        );
         
        const blockBlobClient = window.containerClient.getBlockBlobClient(
          Filename
        );
        const uploadBlobResponse = blockBlobClient.uploadBrowserData(
          this.state.FileUploaded[0]
        );
        FileUrl = "https://shellstorage123.blob.core.windows.net/socialmedia/" + Filename;
        } else {
          FileUrl = ""
      }

      if (!this.state.FileUploaded[0].type.includes("video"))
      {

        MyData.Url = FileUrl;
        //makes api call
  var Results =  await Axios.post(
    `https://computervision123456789.cognitiveservices.azure.com/vision/v2.0/tag?language=en`,
    MyData,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": `89074e4bd4ab4f84b38d5c7811cc831a`
      }
    }
  ).then((results) => {
    const TempTagArr = results.data.tags.filter(
      (result) => result.confidence > 0.75
    );
    TempTagArr.map((tag) => (TempTagList += " " + tag.name + ","));
    TempTagList = TempTagList.slice(0, -1);
  });
      }



      
      MyData.AddPost = {
        PostGuid: PostGuid,
        PostContent: this.state.Post,
        DateCreated: moment().format("LL"),
        FileUrl: FileUrl,
        FileType: this.state.FileType,
        TempTagList : TempTagList
      };


      ApiCall(
        "Post",
        `${process.env.REACT_APP_BackEndUrl}/api/home/AddPost`,
        MyData
      ).then(() => {
        this.props.CloseModal();
        this.context.GetMainPagePosts();
        this.context.GetProfilePagePosts();
        this.context.OpenNoti("Post was Added");
      });
    }
  };

 

  UploadFile = (FileType,SupportedFileTypes ) => {
    this.setState({
      UploadFile: !this.state.UploadFile,
      FileType: FileType,
	  SupportedFileTypes: SupportedFileTypes
    });
  };

  HandleFiles = (files) => {
    
    if (files.length !== 0) {
      this.setState({
        FileUploaded: files
      });
    }
  };


  //keeps track of user input as they type text in
  HandleUpdate = (NewState) => {
    this.setState(NewState);
  };

  render() {
    return (
      <div>
        <Card>
        {this.state.ShowLoader ? (
          <LinearProgress
            classes={{
              root: "UploadLoader"
            }}
          />
        ) : (
          ""
        )}
          <CardHeader
            avatar={
              <Avatar src={this.context.AccountInfo[0].profilePhotoUrl}>
                R
              </Avatar>
            }
            classes={{
              root: "TextAllignLeft",
            }}
            title={this.context.AccountInfo[0].fullName + " | Public"}
          />
          <CardContent>
            <TextField
              value={this.state.Post}
              onChange={(event) =>
                this.HandleUpdate({ Post: event.target.value })
              }
              fullWidth={true}
              label="What's new with you?"
            />
          </CardContent>


          <CardContent>
          <IconButton
          disabled={this.props.ModalType === "Edit" ? true : false}
            onClick={() => {
              this.UploadFile("Image", "image/*");
            }}
          >
            <ImageIcon />
          </IconButton>
          <IconButton
          disabled={this.props.ModalType === "Edit" ? true : false}
            onClick={() => {
              this.UploadFile("Video", "video/*");
            }}
          >
            <VideocamIcon />
          </IconButton>

          <Fade opposite collapse when={this.state.UploadFile}>
            <DropzoneArea
				acceptedFiles={[this.state.SupportedFileTypes]}
              onChange={(event) => this.HandleFiles(event)}
              filesLimit={1}
              maxFileSize={100000000}
            />
          </Fade>
        </CardContent>


          <CardActions disableSpacing>
            <div className="PostIconStyle">
              <Button onClick={this.props.CloseModal}>CANCEL</Button>

              <Button
                onClick={this.SubmitPost}
                disabled={this.state.Post.trim() !== "" ? "" : true}
              >
                {this.props.ModalType === "Edit" ? "UPDATE POST" : "POST"} 
              </Button>
            </div>
          </CardActions>
        </Card>
      </div>
    );
  }
}

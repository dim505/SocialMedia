import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import ProfilePic from "../../download.jpg";
import Avatar from "@material-ui/core/Avatar";
import UploadPhoto from "./UploadPhoto";
import AddAPhotoOutlinedIcon from "@material-ui/icons/AddAPhotoOutlined";
import Fade from "@material-ui/core/Fade";
import SnackBar from "../SnackBar";
import Tooltip from "@material-ui/core/Tooltip";
import BackgroundBanner from "../BackgroundBanner";
import download from "../../download.jpg";
import { ApiCall } from "../ApiCall";
import { Formik } from "formik";
import { EditProfileInfoForm } from "./EditProfileInfoForm";
import * as Yup from "yup";
import Context from "../context";

const validationSchema = Yup.object({
  FullName: Yup.string("Please Enter Your Name").required("Name is Required"),
});

//this component shows the user information and a way to upload photos/banners
export default class ProQckStatsEditProDiag extends Component {
  static contextType = Context;
  state = {
    FileTypeBeingUploaded: "",
    ShowPhotoUpload: false,
    Message: "",
    ProfileUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
    BannerUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
  };

  submitValues = (values) => {
    var MyData = {};
    MyData.AccountInfo = values;
    ApiCall(
      "Post",
      `${process.env.REACT_APP_BackEndUrl}/api/Profile/Add_Update_Account_Info/UpdateProfileInfo`,
      MyData
    ).then(() => {
      if (this.props.CloseDialog !== undefined) {
        this.props.CloseDialog();
      } else {
        this.props.CloseDialog2();
      }
      this.context.GetAccountInfo();
      this.context.GetMainPagePosts();
      this.context.GetProfilePagePosts();
      this.context.OpenNoti("Profile Information Updated");
    });
  };

  //this closes out the account user infomation modal
  HandleUpdateClick = () => {
    this.props.CloseDialog();
  };

  //closes the photo dropzone
  ClosePhotoUpload = (Filename) => {

    if (Filename == undefined) {
      this.setState({
        ShowPhotoUpload: false
      });

    }
    else if (Filename.includes("Banner")) {
      this.setState({
        ShowPhotoUpload: false,
        BannerUrl:
          "https://shellstorage123.blob.core.windows.net/socialmedia/" +
          Filename,
      });
    } else if (Filename.includes("Profile")) {
      this.setState({
        ShowPhotoUpload: false,
        ProfileUrl:
          "https://shellstorage123.blob.core.windows.net/socialmedia/" +
          Filename,
      });
    }
  };

  render() {
    return (
      <Dialog
        open={this.props.OpenDialog}
        onClose={this.props.CloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <BackgroundBanner
            picture={this.context.AccountInfo[0].bannerPhotoUrl}
            PictureSize="200px"
          />
          <div className="Avatar_Center">
            <Avatar
              classes={{
                root: "AvatarStyle",
              }}
              alt="Remy Sharp"
              src={this.context.AccountInfo[0].profilePhotoUrl}
            />
            <Tooltip title="Click To Add Profile Photo">
              <AddAPhotoOutlinedIcon
                onClick={() => {
                  this.setState({
                    ShowPhotoUpload: true,
                    FileTypeBeingUploaded: "ProfilePhoto",
                  });
                }}
                classes={{
                  root: "ChangeAvatarPic",
                }}
              />
            </Tooltip>
            <Typography
              classes={{
                root: "EditProfileModalName",
              }}
              variant="h3"
              gutterBottom
            >
              {this.context.AccountInfo[0].fullName}
            </Typography>
            <Tooltip title="Click To Upload Banner Photo">
              <AddAPhotoOutlinedIcon
                onClick={() => {
                  this.setState({
                    ShowPhotoUpload: true,
                    FileTypeBeingUploaded: "BannerPhoto",
                  });
                }}
                classes={{
                  root: "UploadBannerIcon",
                }}
              />
            </Tooltip>
          </div>

          <Formik
            enableReinitialize={true}
            initialValues={{
              FullName: this.context.AccountInfo[0].fullName,
              CompanyName: this.context.AccountInfo[0].companyName,
              Twitter: this.context.AccountInfo[0].twitter,
              Facebook: this.context.AccountInfo[0].facebook,
              WebAddress: this.context.AccountInfo[0].webAddress,
              Tagline: this.context.AccountInfo[0].tagline,
            }}
            validationSchema={validationSchema}
            onSubmit={this.submitValues}
            render={(props) => (
              <EditProfileInfoForm
                CloseDialog={this.props.CloseDialog}
                {...props}
              />
            )}
          />
        </DialogContent>

        <UploadPhoto
          FileTypeBeingUploaded={this.state.FileTypeBeingUploaded}
          ClosePhotoUpload={this.ClosePhotoUpload}
          ShowPhotoUpload={this.state.ShowPhotoUpload}
        />
      </Dialog>
    );
  }
}

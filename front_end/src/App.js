import React, { Component } from "react";
import LogInScreen from "./Components/LogIn/LogInScreen";
import NavBar from "./Components/NavBar/NavBar";
import MainFeed from "./Components/MainPage/MainFeed";
import ProfileQuickStats from "./Components/ProfilePage/ProfileQuickStats";
import "./Global.css";
import { Route } from "react-router-dom";
import PeoplePage from "./Components/PeoplePage/PeoplePage";
import Logo from "./Components/SharedComponents/SocialMediaLogo.png";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fade from "react-reveal/Fade";
import SnackBar from "./Components/SharedComponents/SnackBar";
import Context from "./Components/SharedComponents/context";
import { ApiCall } from "./Components/SharedComponents/ApiCall";
import Typography from "@material-ui/core/Typography";
import { CircleArrow as ScrollUpButton } from "react-scroll-up-button";
import "./Components/SharedComponents/ShareComponents.css";
import NameReq from "./Components/NameReq";

//parent Component that acts as the parent for all other Components in the social media site
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ShowLoader: true,
      authenticated: false,
      MainPagePosts: [],
      ProfilePagePosts: [],
      Likes: [],
      AccountInfo: [
        {
          fullName: "",
          companyName: "",
          twitter: "",
          facebook: "",
          webAddress: "",
          Tagline: "",
        },
      ],
    };
  }

  //sets title, get data, check if visiting user is authenticated
  async componentDidMount() {
    window.getTokenSilently = await this.props.auth.getTokenSilently();
    document.title = "Social Media";
    this.LoadAzureStorage();
    this.GetMainPagePosts();
    this.GetProfilePagePosts();
    this.GetLikedPosts();
    this.GetAccountInfo();
    this.isUserAuthenticated();
  }

  //checks to see if user is authenticated
  async isUserAuthenticated() {
    const isLoggedIn = await this.props.auth.isAuthenticated();
    this.setState({ authenticated: isLoggedIn });
    setTimeout(() => {
      this.setState({
        ShowLoader: false,
      });
    }, 3000);
  }

  //gets all the posts related to the main page
  GetMainPagePosts = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/home/GetPosts/MainPagePosts`
    ).then((results) => {
      this.setState({
        MainPagePosts: results,
      });
    });
  };

  //gets all the posts related to the main page
  GetProfilePagePosts = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/home/GetPosts/ProfilePosts`
    ).then((results) => {
      this.setState({
        ProfilePagePosts: results,
      });
    });
  };

  GetLikedPosts = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/home/GetLikes`
    ).then((results) => {
      this.setState({
        Likes: results,
      });
    });
  };

  GetAccountInfo = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/Profile/GetAccountInfo`
    ).then((results) => {
      if (results.length > 0) {
        this.setState({
          AccountInfo: results,
        });
      }
    });
  };
  //function opens notification alert
  OpenNoti = (message) => {
    this.setState({
      OpenNoti: true,
      Message: message,
    });
  };
  //function closes  notification alert
  CloseNoti = () => {
    this.setState({
      OpenNoti: false,
    });
  };

  //loads the azure services needed for photo upload
  LoadAzureStorage = () => {
    var blobSasUrl =
      "https://shellstorage123.blob.core.windows.net/?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2020-10-01T00:21:49Z&st=2020-09-01T16:21:49Z&spr=https&sig=j71oprnbo95XLKLoIA9Cpxn53%2BbYuRdFpjGIASM6rxc%3D";
    const {
      BlobServiceClient,
      StorageSharedKeyCredential,
    } = require("@azure/storage-blob");

    window.blobServiceClient = new BlobServiceClient(blobSasUrl);
  };

  render() {
    return (
      <Context.Provider
        value={{
          test: "123",
          OpenNoti: (message) => this.OpenNoti(message),
          CloseNoti: () => this.CloseNoti(),
          GetMainPagePosts: () => this.GetMainPagePosts(),
          GetProfilePagePosts: () => this.GetProfilePagePosts(),
          GetLikedPosts: () => this.GetLikedPosts,
          GetAccountInfo: () => this.GetAccountInfo(),
          MainPagePosts: this.state.MainPagePosts,
          ProfilePagePosts: this.state.ProfilePagePosts,
          Likes: this.state.Likes,
          AccountInfo: this.state.AccountInfo,
        }}
      >
        <div className="App">
          {!this.state.authenticated ? (
            <Fade collapse>
              <LogInScreen auth={this.props.auth} />
            </Fade>
          ) : (
            <div>
              <Fade collapse unmountOnExit when={this.state.ShowLoader}>
                <div className={`Loader `}>
                  <LinearProgress />
                  <img src={Logo} />
                </div>
              </Fade>
              <div
                className={`MainBodyStyle ${
                  !this.state.ShowLoader ? "MainBodyStyleFade" : ""
                }`}
              >
                <NavBar auth={this.props.auth} />
                <Route exact path="/">
                  <Fade collapse>
                    <MainFeed />
                  </Fade>
                </Route>

                <Route path="/Profile">
                  <Fade collapse>
                    <p>PROFILE SECTION </p>
                    <ProfileQuickStats />
                  </Fade>
                </Route>
                <Route path="/People">
                  <Fade collapse>
                    <PeoplePage />
                  </Fade>
                </Route>

                <NameReq AccountInfo={this.state.AccountInfo} />

                <SnackBar
                  OpenNoti={this.state.OpenNoti}
                  CloseNoti={this.CloseNoti}
                  message={this.state.Message}
                />
              </div>

              <div className="TurnToLandScape">
                {" "}
                <Typography variant="h2" gutterBottom>
                  Please turn your device to landscape to view this application
                </Typography>
                <ScrollUpButton />
              </div>

              <ScrollUpButton />
            </div>
          )}
        </div>
      </Context.Provider>
    );
  }
}

export default App;

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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ShowLoader: true,
      authenticated: false,
      Posts: [],
    };
  }

  //sets title, get data, check if visiting user is authenticated
  async componentDidMount() {
    window.getTokenSilently = await this.props.auth.getTokenSilently();
    document.title = "Social Media";
    this.LoadAzureStorage();
    this.GetPosts();
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

  GetPosts = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/home/GetPosts`
    ).then((results) => {
      this.setState({
        Posts: results,
      });
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
          GetPosts: () => this.GetPosts(),
          Posts: this.state.Posts,
        }}
      >
        <div className="App">
          {!this.state.authenticated ||
          !window.location.search.includes("code=") ? (
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

                <SnackBar
                  OpenNoti={this.state.OpenNoti}
                  CloseNoti={this.CloseNoti}
                  message={this.state.Message}
                />
              </div>
            </div>
          )}
        </div>
      </Context.Provider>
    );
  }
}

export default App;

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
import SearchResults from "./Components/NavBar/SearchResults"
import { withRouter } from "react-router-dom";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

//parent Component that acts as the parent for all other Components in the social media site
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ShowLoader: true,
      authenticated: false,
      MainPagePosts: [],
      ProfilePagePosts: [],
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
    this.NavBarChild = React.createRef();
  }

  //sets title, get data, check if visiting user is authenticated
  async componentDidMount() {
    window.prevScrollpos = 0;
    window.ViewUserProfile = "-1";
    window.getTokenSilently = await this.props.auth.getTokenSilently();
    document.title = "Fusion Connect";
    this.LoadAzureStorage();
    this.GetMainPagePosts();
    this.GetProfilePagePosts();
    this.GetAccountInfo();
    this.isUserAuthenticated();
    this.unlisten = this.props.history.listen((location, action) => {
      console.log(location.pathname)
      if (location.pathname !== "/Profile" && window.ViewUserProfile !== "-1") {
        window.ViewUserProfile = "-1";
        this.GetAccountInfo();
        this.GetProfilePagePosts();
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
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
      `${process.env.REACT_APP_BackEndUrl}/api/home/GetPosts/MainPagePosts/${window.ViewUserProfile}`
    ).then((results) => {
      this.setState({
        MainPagePosts: results,
      });
    });
  };

  //gets all the posts related to the profile page
  GetProfilePagePosts = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/home/GetPosts/ProfilePosts/${window.ViewUserProfile}`
    ).then((results) => {
      this.setState({
        ProfilePagePosts: results,
      });
    });
  };

 

  GetAccountInfo = () => {
    ApiCall(
      "Get",
      `${process.env.REACT_APP_BackEndUrl}/api/Profile/GetAccountInfo/${window.ViewUserProfile}`
    ).then((results) => {
      if (results.length > 0) {
        this.setState({
          AccountInfo: results,
        });
      }
    });
  };
  //function opens notification alert
  OpenNoti = (message, autoHideDuration) => {
    this.setState({
      OpenNoti: true,
      Message: message,
      autoHideDuration: autoHideDuration 
    });
  };
  //function closes  notification alert
  CloseNoti = () => {
    this.setState({
      OpenNoti: false,
    });
  };

  RedirectToPage = (PageToPush) => {
    const {history} = this.props
    this.NavBarChild.current.HandleMenuClick(PageToPush.substring(1))
	  history.push(PageToPush)
  }

  //loads the azure services needed for photo upload
  LoadAzureStorage = () => {
    var blobSasUrl =
      "https://shellstorage123.blob.core.windows.net/?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2022-08-30T18:55:43Z&st=2020-10-04T10:55:43Z&spr=https&sig=8FOqoHQU7swZB5qlRGdqSYNAJel2WeoT%2FpW743Jqx%2FE%3D";
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
          OpenNoti: (message, autoHideDuration) => this.OpenNoti(message, autoHideDuration),
          CloseNoti: () => this.CloseNoti(),
          GetMainPagePosts: () => this.GetMainPagePosts(),
          GetProfilePagePosts: () => this.GetProfilePagePosts(),
          GetLikedPosts: () => this.GetLikedPosts,
          GetAccountInfo: () => this.GetAccountInfo(),
          RedirectToPage: (PageToPush) => this.RedirectToPage(PageToPush),
          MainPagePosts: this.state.MainPagePosts,
          ProfilePagePosts: this.state.ProfilePagePosts,
          AccountInfo: this.state.AccountInfo,
          ShowLoader: this.state.ShowLoader,
        }}
      >
        <div className="App">
          {!this.state.authenticated ? (
            <Fade collapse>
              <LogInScreen auth={this.props.auth} />


            </Fade>
          ) : (
            <div>

<PerfectScrollbar onScrollUp={(container  ) => {
  /* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
  var currentScrollPos = container.scrollTop;
  console.log(container.scrollTop )
  if (window.prevScrollpos > currentScrollPos) {
    document.getElementById("NavBar").style.top = "0";
  }
  window.prevScrollpos = currentScrollPos
  }}
  
  onScrollDown={(container) => {

    var currentScrollPos = container.scrollTop;
    if (window.prevScrollpos < currentScrollPos && window.innerWidth < 1024) {
      document.getElementById("NavBar").style.top = "-55px";
    }
    window.prevScrollpos = currentScrollPos 
  }}
  
  
  
  >

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
                <NavBar 
                ref={this.NavBarChild}
                auth={this.props.auth} />
                <Route exact path="/">
                  <Fade collapse>
                    <MainFeed />
                  </Fade>
                </Route>
                <Route path="/Profile">
                  <Fade collapse>         
                    <ProfileQuickStats />
                  </Fade>
                </Route>
                <Route path="/People">
                  <Fade collapse>
                    <PeoplePage />
                  </Fade>
                </Route>
				<Route path="/SearchResults">
                  <Fade collapse>
                    <SearchResults />
                  </Fade>
                </Route>
                <NameReq AccountInfo={this.state.AccountInfo} />
              </div>


              <ScrollUpButton />
              </PerfectScrollbar>

            </div>
          )}

<div className="TurnToLandScape">
                {" "}
                <Typography variant="h2" gutterBottom>
                  Please turn your device to landscape to view this application
                </Typography>
                <ScrollUpButton />
              </div>


        <SnackBar
                  autoHideDuration= {this.state.autoHideDuration}
                  OpenNoti={this.state.OpenNoti}
                  CloseNoti={this.CloseNoti}
                  message={this.state.Message}
                />
        </div>
      </Context.Provider>
    );
  }
}

export default withRouter(App);

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
import Slide from "@material-ui/core/Slide";

//gets app data upon load
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ShowLoader: true,
      authenticated: false,
    };
  }

  //sets title, get data, check if visiting user is authenticated
  componentDidMount() {
    document.title = "Social Media";
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

  render() {
    return (
      <div className="App">
        {this.state.authenticated ||
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
                <MainFeed />
              </Route>

              <Route path="/Profile">
                <p>PROFILE SECTION </p>
                <ProfileQuickStats />
              </Route>
              <Route path="/People">
                <PeoplePage />
              </Route>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;

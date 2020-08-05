import React, { Component } from "react";
import LogInScreen from "./Components/LogIn/LogInScreen";
import NavBar from "./Components/NavBar/NavBar";
import MainFeed from "./Components/MainPage/MainFeed";
import ProfileQuickStats from "./Components/ProfileQuickStats";
import "./Global.css";
//gets app data upon load
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
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
    setTimeout(() => this.setState({ ShowBody: true }), 3000);
  }

  //redirects user to log in page
  Login = () => {
    this.props.auth.loginWithRedirect();
  };

  render() {
    return (
      <div className="App">
        <LogInScreen />
        <div className="MainBodyStyle">
          <NavBar />
          <MainFeed />
          <p>PROFILE SECTION </p>
          <ProfileQuickStats />
        </div>
      </div>
    );
  }
}

export default App;

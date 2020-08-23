import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import createAuth0Client from "@auth0/auth0-spa-js";

const auth0 = async () =>
  createAuth0Client({
    domain: "dev-5wttvoce.auth0.com",
    client_id: "YHMMlUZVF7EnyuEatZKI641Jt9hT7QaN",
    //Redirect URL when authenication suceeds
    redirect_uri: `${process.env.REACT_APP_FrontEndSiteURL}`,
    audience: "https://SocialMedia.com",
  });

auth0().then((auth) => {
  ReactDOM.render(
    <BrowserRouter basename="/">
      <App auth={auth} />
    </BrowserRouter>,
    document.getElementById("root")
  );
});

//https://stackoverflow.com/questions/51391051/call-child-component-function-from-parent

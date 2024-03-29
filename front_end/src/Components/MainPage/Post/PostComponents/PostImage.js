import React, { Component } from "react";
import "react-awesome-lightbox/build/style.css";
import Lightbox from "react-awesome-lightbox";
import Typography from "@material-ui/core/Typography";

//renders image when post contains an image 
export default class PostImage extends Component {
  state = { OpenLightBox: false };
  
	//when opening photo gallery, it makes the nav bar disappear 
  OpenLightBox = () => {
    window.NavBarDrawer = document.getElementById("NavBarDrawer");
    window.NavBarDrawer.classList.add("disappear");
    window.NavBar = document.getElementById("NavBar");
    window.NavBar.classList.add("disappear");

    this.setState({
      OpenLightBox: true
    });
  };

	//when closing photo gallery, it makes the nav bar reappear/photo gallery disappear
	
  CloseLightBox = () => {
    window.NavBarDrawer.classList.remove("disappear");
    window.NavBar.classList.remove("disappear");
    this.setState({
      OpenLightBox: false
    });
  };

  render() {
    return (
      <div>
        {this.state.OpenLightBox === true ? (
          <Lightbox
            onClose={() => this.CloseLightBox()}
            image={this.props.post.fileUrl}
          />
        ) : (
          ""
        )}
 
        <img
          onClick={() => this.OpenLightBox()}
          className="PostImage"
          src={this.props.post.fileUrl}
          alt="Img"
        />

<Typography variant="overline" display="block" gutterBottom>
          Tags: {this.props.post.tempTagList}
        </Typography>


        <Typography
          classes={{
            body1: "PostContent"
          }}
          variant="body1"
        >
		{this.props.post.postContent}
        </Typography>
      </div>
    );
  }
}

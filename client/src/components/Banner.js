import React from 'react';
import {Button} from 'lucid-ui';
import { withRouter,Redirect } from 'react-router-dom';

function Banner(props){
  /*
  * Function Name: returnHome()
  * Description: This returns the user back to the home page or "/"
  * Output:   home page
  */
  function returnHome(){
    props.history.push("/")
  }
  /*
  * Function Name: checkLogInPage()
  * Description: This checks if the user is on the login page
  * Output:  a return to home button
  */
  function checkLogInPage(){
    if(props.location.pathname === "/signup"||props.location.pathname === "/login"){
    return(
      <div id="user-pane-banner">
      <Button className="text-cell" kind='danger' style={{ padding: "15px" ,fontSize:"15px"}} onClick={()=>returnHome()}>Return to Home</Button>
      </div>)
    }
  }
  /*
  * Function Name: checkWatchPage()
  * Description: This checks if the user is on the Watch Page
  * Output:  a tutorial popup
  */
  function checkWatchPage(){
    if(props.location.pathname === "/watch"){
      return(
        <Button id="color-button" style={{marginRight:'5px',padding: "16px" ,fontSize:"15px" }} onClick={()=>{localStorage.setItem("seenTutorial",false);props.handleShow()}}>
                Help
                </Button>)
    }
  }
    return (
      <div id="banner">
        {props.bannerExit && <Redirect to="/goodbye" />}
        <div className="text-cell" id="banner-app-name">
        Crowdsource Video Classification
        </div>
        {checkLogInPage()}
        {props.user && (
        <div id="user-pane-banner">
        <div id="welcome-name"  >Welcome, {props.user}</div>
          {checkWatchPage()}
          <Button style={{ padding: "15px" ,fontSize:"15px"}}  className="text-cell" kind='danger' onClick={()=>{
            props.setGlobalUsername("");
            props.setBannerExit(false);
            props.setBannerExit(true)}}>
            Sign Out
            </Button>
        </div>)}
        {!props.user && <div/>}
      </div>
    )
}
export default withRouter(Banner);
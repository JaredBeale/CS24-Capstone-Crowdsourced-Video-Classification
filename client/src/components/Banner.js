import React from 'react';
import {Button} from 'lucid-ui';
import { withRouter,Redirect } from 'react-router-dom';





function Banner(props){

  function returnHome(){
  props.history.push("/")
  }
  function checkLogInPage(){
    if(props.location.pathname === "/signup"||props.location.pathname === "/login"){
    return(
      <div id="user-pane-banner">
      <Button className="text-cell" kind='danger' style={{ padding: "15px" ,fontSize:"15px"}} onClick={()=>returnHome()}>Return to Home</Button>
      </div>)

    }
  }

  function checkWatchPage(){
    if(props.location.pathname === "/watch"){
    return(
      <Button id="color-button" style={{marginRight:'5px' }} onClick={()=>{localStorage.setItem("seenTutorial",false);props.handleShow()}}>
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
        <Button  className="text-cell" kind='danger' onClick={()=>{
          props.setGlobalUsername("");
          props.setBannerExit(false);
      props.setBannerExit(true)
}
                                                     }>
            Sign Out
          </Button>

      </div>)}
      {!props.user && <div/>}
    </div>
  )

}
export default withRouter(Banner);
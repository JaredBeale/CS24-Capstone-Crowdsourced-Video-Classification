import React from 'react';
import {Button} from 'lucid-ui';
import { withRouter } from 'react-router-dom';





function Banner(props){

  function returnHome(){
  props.history.push("/")
  }
  function checkLogInPage(){
    if(props.location.pathname === "/signup"||props.location.pathname === "/login"){
    return(
      <div id="user-pane-banner">
      <Button className="text-cell" kind='danger' onClick={()=>returnHome()}>Return to Home</Button>
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


      <div className="text-cell" id="banner-app-name">
    Crowdsource Video Classification
      </div>
      {checkLogInPage()}

      {props.user && (
      <div id="user-pane-banner">

        <div className="text-cell" >Welcome, {props.user}</div>
          {checkWatchPage()}
        <Button  className="text-cell" kind='danger' onClick={()=>{
                                                      localStorage.setItem("username", "");
                                                      props.setGlobalUsername("");
                                                     }}>
            Sign Out
          </Button>

      </div>)}
      {!props.user && <div/>}
    </div>
  )

}
export default withRouter(Banner);
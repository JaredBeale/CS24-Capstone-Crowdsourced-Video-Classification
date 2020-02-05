import React from 'react';
import {Button} from 'lucid-ui';
import {Link} from "react-router-dom";





export default function Banner(props){
  var {history} = props;
  return (
    <div id="banner">
      <div className="text-cell" id="banner-app-name">
    Crowdsource Video Classification
      </div>
      {props.user && (
      <div id="user-pane-banner">
        <div className="text-cell" >Welcome, {props.user}</div>
        <Button  className="text-cell" kind='danger' onClick={()=>{
                                                      localStorage.setItem("username", "");
                                                      props.setGlobalUsername("");
                                                     }}>
            Sign Out
          </Button>
      </div>)}
      {!props.user && <Link style={{marginTop:"auto",marginBottom:"auto"}}to="/login">Please Log in</Link>}
    </div>
  )

}

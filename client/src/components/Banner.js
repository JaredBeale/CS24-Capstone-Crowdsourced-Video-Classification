import React from 'react';
import {Button} from 'lucid-ui';
import {Link} from "react-router-dom";



function signOut(){
  localStorage.setItem("username", "");
  window.location.href= "/login";
}


export default function Banner(props){
  return (
    <div id="banner">
      <div className="text-cell" id="banner-app-name">
        <Link to="/">CCTV</Link>
      </div>
      {props.user && (
      <div id="user-pane-banner">
        <div className="text-cell" >Welcome, {props.user}</div>
        <Button  className="text-cell" kind='danger' onClick={()=>signOut()}>
            Sign Out
          </Button>
      </div>)}
      {!props.user && <Link to="/login">Login</Link>}
    </div>
  )

}

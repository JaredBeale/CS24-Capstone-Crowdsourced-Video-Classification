import React from 'react';
import { BrowserRouter as Router,Route, Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import { createBrowserHistory } from "history";



import { Button, Panel} from 'lucid-ui';

import './index.css';
import './lucid-ui.css';

import GoodbyePage from "./components/ExitPage"
import VideoPage from './components/VideoPage';
import LoginPage from './components/LoginPage';
import Banner from "./components/Banner"


const history = createBrowserHistory();




class App extends React.Component {
   constructor(props){
    var storedUsername = localStorage.getItem("username");
    var storedTutorial = localStorage.getItem("seenTutorial");

    if (storedUsername === null) {
      storedUsername = "";
      localStorage.setItem("username", storedUsername);
    } else {
      localStorage.setItem("username", storedUsername);
    }
    if (storedTutorial === null) {
      storedTutorial = false;
      localStorage.setItem("seenTutorial", storedTutorial);
    } else {
      localStorage.setItem("seenTutorial", storedTutorial);
    }
    super(props);
    this.state = {

      isShown: JSON.parse(storedTutorial),
      globalUsername: storedUsername,
      bannerExit: false,
    }
  }

  setGlobalUsername = (username) => {
    this.setState({globalUsername:username});
  }
  setIsShown=(shown)=>{

   this.setState({isShown: shown})
 }
   handleShow=()=>{
     console.log(this.state.isShown)
    this.setState({isShown: !this.state.isShown})
  }
  setBannerExit=(banner)=>{
    this.setState({bannerExit:banner});

  }

  render(){
    if(localStorage.getItem("username")!== "" ){
        history.push('/watch')
    }
    return(
      <Router history={history}>
        <div>
          <Banner isShown={this.state.isShown}
          handleShow={this.handleShow}
          bannerExit={this.state.bannerExit}
          setBannerExit={this.setBannerExit}
                  setGlobalUsername={this.setGlobalUsername}
                  user={this.state.globalUsername} />

          <Route path="/goodbye"  >
          <GoodbyePage
            onLogout={this.setGlobalUsername}
            setGlobalUsername={this.setGlobalUsername}
            bannerExit={this.state.bannerExit}
            setBannerExit={this.setBannerExit}
            user={this.state.globalUsername} />
          </Route>

          <Route path="/watch">
            <VideoPage
            setBannerExit={this.setBannerExit}

            handleShow={this.handleShow}
                      isShown={this.state.isShown}
                        setGlobalUsername={this.setGlobalUsername}
                        globalUsername={this.state.globalUsername}/>
          </Route>
          <Route path="/login">
            <LoginPage
              isNewUser={false}
              setIsShown={this.setIsShown}
              setGlobalUsername={this.setGlobalUsername}
              globalUsername={this.state.globalUsername}/>
          </Route>
          <Route path="/signup">
            <LoginPage
              isNewUser={true}
              setIsShown={this.setIsShown}
              setGlobalUsername={this.setGlobalUsername}
              globalUsername={this.state.globalUsername} />
          </Route>
          <Route exact path="/">
            <Dashboard />
          </Route>
        </div>
      </Router>
    );
  }
}


function Dashboard(props){
  return (
      <div >

        <div>
        <div id="dashboard-container">
          <Panel id="dashboard">
            <Panel.Header>
              <strong style={{ fontSize: "20px",textAlign: "left"}}>Welcome! Are you a New or Returning user?</strong>
            </Panel.Header>
            <Panel.Footer style={{textAlign: "center"}}>
              <Link style={{ marginRight: "7px"}} to='/signup'><Button style={{ width:"123px" ,padding: "20px" ,fontSize:"20px"}}  kind='primary' >New</Button></Link>
              <Link id="LogIn" to='/login'><Button style={{width:"123px", padding: "20px" ,fontSize:"20px"}}  kind='danger' >Returning</Button></Link>
            </Panel.Footer>
          </Panel>
          </div>
          <article id="faq">
          <h3>FAQ:</h3>
          <h5>What is this for?</h5>
          <p>
            We are trying to train a computer program to recognize emotion in video so that we can better match ads to the content.
            </p>
          <h5>How does my participation help?</h5>
          <p>
            We need to have a set of videos that are already labeled to train with. By voting on the labels, your contribution will help select the proper emotion for each video in our set so that the computer can learn.
            </p>
          <h5>How long will this take?</h5>
          <p>
            Each video is short, usually under five seconds. Some are even under 0.10 seconds! Do as many as you’d like and you can exit whenever you choose.
            </p>
          </article>
        </div>

      </div>
  )
}


export default withRouter(App)

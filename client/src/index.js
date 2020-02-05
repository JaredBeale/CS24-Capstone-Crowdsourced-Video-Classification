import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router,Route, Link} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import {withRouter} from 'react-router-dom';
import { createBrowserHistory } from "history";



import { Button, Panel} from 'lucid-ui';

import './index.css';
import './lucid-ui.css';

import VideoPage from './components/VideoPage';
import LoginPage from './components/LoginPage';
import Banner from "./components/Banner"


const history = createBrowserHistory();




class CCTV extends React.Component {
   constructor(props){
    var storedUsername = localStorage.getItem("username");
    if (storedUsername === null) {
      storedUsername = "";
      localStorage.setItem("username", storedUsername);
    } else {
      localStorage.setItem("username", storedUsername);
    }
    super(props);
    this.state = {
      hasSeenTutorial: false,
      globalUsername: storedUsername,

    }
  }

  setGlobalUsername = (username) => {
    this.setState({globalUsername:username});
  }
  setHasSeenTutorial= (seen) => {
    this.setState({hasSeenTutorial:seen});
  }
  render(){
    if(localStorage.getItem("username")!== "" ){
        history.push('/watch')
    }
    return(
      <Router history={history}>
        <div>
          <Banner setGlobalUsername={this.setGlobalUsername}
                  user={this.state.globalUsername} />

          <Route path="/watch">
            <VideoPage hasSeenTutorial={this.state.hasSeenTutorial}
                        setGlobalUsername={this.setGlobalUsername}
                        globalUsername={this.state.globalUsername}/>
          </Route>
          <Route path="/login">
            <LoginPage
              setHasSeenTutorial={this.setHasSeenTutorial}
              isNewUser={false}
              setGlobalUsername={this.setGlobalUsername}
              globalUsername={this.state.globalUsername}/>
          </Route>
          <Route path="/signup">
            <LoginPage
              setHasSeenTutorial={this.setHasSeenTutorial}
              isNewUser={true}
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
      <div id="dashboard">

        <div>
          <Panel>
            <Panel.Header>
              <strong>Welcome! Are you a New or Returning user?</strong>
            </Panel.Header>
            <Panel.Footer>
              <Link to='/signup'><Button >New</Button></Link>
              <Link to='/login'><Button >Returning</Button></Link>
            </Panel.Footer>
          </Panel>
        </div>

      </div>
  )
}


export default withRouter(CCTV)

ReactDOM.render(<CCTV />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

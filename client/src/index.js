import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router,Route, Link} from 'react-router-dom';
import VideoPage from './components/VideoPage';
import SignUpPage from './components/SignUpPage';
import * as serviceWorker from './serviceWorker';
import { DataTable, Button, Panel, TextField, Dialog } from 'lucid-ui';
import LogInPage from './components/LogInPage';
import { createBrowserHistory } from "history";

import {withRouter} from 'react-router-dom';
import './index.css';
import './lucid-ui.css';

const style = {
  marginBottom: '10px',
};


const history = createBrowserHistory();

class App extends React.Component {





class CCTV extends React.Component {
   constructor(props){
    var storedUsername = localStorage.getItem("username");
if (storedUsername === null) {
  console.log("was null setting to blank for init");
  storedUsername = "";
  localStorage.setItem("username", storedUsername);
} else {

  localStorage.setItem("username", storedUsername);
}
    super(props);
    this.state = {
      globalUsername: storedUsername,
    }
  }

  setGlobalUsername = (username) => {
    this.setState({globalUsername:username});
  }

  render(){
    if(localStorage.getItem("username")!== "" ){
        history.push('/watch')
    }


    return(
      <Router history={history}>
        <div>



          <Route path="/watch">

            <VideoPage setGlobalUsername={this.setGlobalUsername} globalUsername={this.state.globalUsername}/>
          </Route>
          <Route path="/signup">
            <SignUpPage setGlobalUsername={this.setGlobalUsername} globalUsername={this.state.globalUsername}/>
          </Route>
          <Route path="/login">
            <LogInPage setGlobalUsername={this.setGlobalUsername} globalUsername={this.state.globalUsername}/>

          </Route>
          <Route exact path="/">

          <Panel>
            <Panel.Header>
              <strong>Are you a New or Returning user?</strong>
            </Panel.Header>
            <Panel.Footer>
              <Link to='/signup'><Button>New</Button></Link>
              <Link to='/login'><Button>Returning</Button></Link>
            </Panel.Footer>
          </Panel>
          </Route>
        </div>
      </Router>
    );
  }
}

export default withRouter(CCTV)

ReactDOM.render(<CCTV />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

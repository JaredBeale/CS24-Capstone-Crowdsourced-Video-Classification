import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router,Route, Link} from 'react-router-dom';
import './index.css';
import VideoPage from './components/VideoPage';
import LoginPage from './components/LoginPage';
import * as serviceWorker from './serviceWorker';
import { Tabs } from 'lucid-ui';
import {withRouter} from 'react-router-dom';



class App extends React.Component {
  render(){
    return(
      <Router>
        <div>


        <div class="tab">
          <Link className="tablinks" to="/">Home</Link>
          <Link className="tablinks"  to="/watch">Watch</Link>
          <Link className="tablinks"  to="/login">Login</Link>
        </div>
          <Route path="/watch">
            <VideoPage/>
          </Route>
          <Route path="/login">
            <LoginPage/>
          </Route>
          <Route exact path="/">
            <div>
              This will be the home page. Click on one of the Tabs to navigate.
            </div>
          </Route>
        </div>
      </Router>
    );
  }
}

export default withRouter(App)

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

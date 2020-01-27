import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router,Route, Link} from 'react-router-dom';
import './index.css';
import VideoPage from './components/VideoPage';
import LoginPage from './components/LoginPage';
import * as serviceWorker from './serviceWorker';
import { Tabs } from 'lucid-ui';
import {withRouter} from 'react-router-dom';
import "../node_modules/lucid-ui/dist/lucid.css";




class App extends React.Component {
  nextPath(path) {
    this.props.history.push(path);
  }

  render(){
    return(
    <Router>
      <div>
      <Tabs >
          <Tabs.Tab  Title='Home' className='one' >

          </Tabs.Tab>

          <Tabs.Tab Title='Watch' >

          </Tabs.Tab>
          <Tabs.Tab Title='Login'>

          </Tabs.Tab>

        </Tabs>
        <Route path="/watch">
          <VideoPage />
        </Route>
        <Route path="/login">
        <LoginPage/>
        </Route>
        <Route exact path="/">
        <div>
          <Link to="/watch">WatchVideo</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
        </div>

        </Route>
      </div>
    </Router>
    );
  }

}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

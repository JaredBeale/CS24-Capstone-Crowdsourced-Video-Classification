import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router,Route, Link} from 'react-router-dom';
import './index.css';
import VideoPage from './components/VideoPage';
import LoginPage from './components/LoginPage';
import * as serviceWorker from './serviceWorker';
import { Tabs } from 'lucid-ui';
import {withRouter} from 'react-router-dom';
import "../node_modules/lucid-ui/dist/lucid.css";


import { createBrowserHistory } from 'history';

export default createBrowserHistory();

class App extends Component {

  goLogin() {
     this.props.history.push('/login')
   }
  render(){
    return(
    <Router>
      <div>
      <Tabs >
          <Tabs.Tab   Title='Home' className='one' >

          </Tabs.Tab>

          <Tabs.Tab Title='Watch' >

          </Tabs.Tab>
          <Tabs.Tab  onSelect={this.goLogin} Title='Login'>

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

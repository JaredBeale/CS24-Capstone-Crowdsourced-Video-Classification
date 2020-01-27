import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router,Route, Link} from 'react-router-dom';
import './index.css';
import VideoPage from './components/VideoPage';
import * as serviceWorker from './serviceWorker';

import "../node_modules/lucid-ui/dist/lucid.css";




class App extends React.Component {

  render(){
    return(
    <Router>
      <div>
        <Route path="/watch">
          <VideoPage />
        </Route>
        <Route path="/login">
          <h1> pls login </h1>
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

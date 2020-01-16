import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = { message: "" }

  componentDidMount() {
    this.getMessage();
  }

  getMessage = () => {
    fetch('/api/helloworld')
      .then(res => res.json())
      .then(message => this.setState({ message }));
  }

  render() {
    const { message } = this.state;
    return (
      <div classNam="App">
        {message ? (
          <h1>{message}</h1>
        ) : (
	  <h1>Error</h1>
	)}
      </div>
    );
  }
}

export default App;

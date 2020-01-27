import React, { Component} from 'react';
import { LoadingIndicator, LoadingIcon,  SearchableSingleSelect } from 'lucid-ui';
import { Tabs, Button, Panel,CheckIcon,TextField } from 'lucid-ui';


const {
  LoadingMessage,
} = LoadingIndicator;
const style = {
  marginBottom: '10px',
};
const { Option } = SearchableSingleSelect;


class LoginPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      createdUsername: '',
    }
  }
  componentDidMount(){
  }

  SignUp(){
    var data = {username: this.state.username};
    console.log(data);
    fetch('/api/create/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(
  data
  )
}).then((response) => response.json())
.then((data) => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
}


  render(){
    return (
      <div>
      <Panel>
            <Panel.Header>
              <strong>Please Create a Username or Log In {this.state.createdUsername} </strong>
            </Panel.Header>
            <TextField
                style={style}
                placeholder='Username...'
                value={this.state.username}
                onChange={username => this.setState({ username })}
              />
            <Panel.Footer>
              <Button>Log in</Button>
              <div/>

                <Button onClick={()=>this.SignUp()}>Sign Up</Button>
            </Panel.Footer>
          </Panel>
          </div>
      )
  }
}
export default LoginPage;




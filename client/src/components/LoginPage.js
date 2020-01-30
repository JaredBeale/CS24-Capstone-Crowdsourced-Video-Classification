import _ from 'lodash';
import React, { Component } from 'react';
import { DataTable, Button, Panel, TextField, Dialog } from 'lucid-ui';
import { withRouter } from 'react-router-dom'


const style = {
  marginBottom: '10px',
};

const property = {
  hasFixedHeader: true,
  isSelectable: false,
  hasLightHeader: false,
  fixedColumnCount: 1,
  fixedRowHeight: 40,
  isActionable: false,
}

class LogInPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      createdUsername: '',
      listUsername: [],
      status:'',
      errorMessage:'',
    }
  }

  componentDidMount(){
    this.getUsernames();
  }

  clearErrorMessage = () => {
    this.setState({ errorMessage: '' });
  }

  getUsernames(){
    fetch('/api/names/users', {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (!response.ok) {
          this.setErrorMessage(response.json().content);
      }
      return response.json();
    }).then((data) => {
      var listedUsernames = []
      for(var i = 0; i < data.length; i++){
        listedUsernames.push({"username":data[i]});
      }
      this.setState({listUsername:listedUsernames.reverse()});
    })
    .catch((error) => {
      console.error('Error:', error);
      this.setState({status:error})
    });
  }
  signUp(){
    var data = {name: this.state.username};
    fetch('/api/create/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((response) => {
        if (response.status === 400) {
          console.log('failure');
          response.json().then(info => this.setState({ errorMessage: info.content}));
        }
        else if (response.ok) {
          console.log('success');
          this.setState({status:data.success})
          this.getUsernames();

          this.props.setGlobalUsername(data.name);
              localStorage.setItem("username", data.name);
            console.log("did we get here")
          this.props.history.push('/watch')
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({status:error.toString()});

      });
  }

  logIn(){
    var currentUsername = this.state.username;
    var listedUsernames = this.state.listUsername;
console.log(listedUsernames);
    for(var i = 0; i < listedUsernames.length; i++){
      if(currentUsername===listedUsernames[i].username){
        console.log("Name Found! Logging in...")
        this.props.setGlobalUsername(currentUsername);
            localStorage.setItem("username", currentUsername);

        this.props.history.push('/watch')
      }

    }
    console.log("name not found")
 this.setState({ errorMessage: "Username "+currentUsername +" does not exist in the Database."});

  }
  returnHome(){
    this.props.history.push("/");
  }

  checkNewUserHeader(){
    if(this.props.isNewUser===true){
      return "Please Create a Username";
    }
    else{
      return "Please Enter your Username Below to Log In"
    }
  }

  checkNewUserButton(){
    if(this.props.isNewUser===true){
      return   <Button kind='primary' onClick={()=>this.signUp()}>Sign Up</Button>

    }
    else{
      return    <Button kind='primary' onClick={()=>this.logIn()}>Log In</Button>

    }
  }
  render() {
    if(localStorage.getItem("username")!== "" ){
        this.props.history.push('/watch')
    }

    return (
      <div>
      <Panel>
      <Button  onClick={()=>this.returnHome()}>Return to Home</Button>
</Panel>
        <Panel>
          <Panel.Header>
            <strong>{this.checkNewUserHeader()}</strong>
          </Panel.Header>
          <TextField
            style={style}
            placeholder='Username...'
            value={this.state.username}
            onChange={username => this.setState({ username })}
          />
          <Panel.Footer>
            {this.checkNewUserButton()}
          </Panel.Footer>
        </Panel>

        {this.state.errorMessage &&
          <Dialog
            isShown='true'
            onEscape={this.clearErrorMessage}
            handleClose={this.clearErrorMessage}
            Header='Error'
            size='small'
          >
            {this.state.errorMessage}
          </Dialog>
        }
      </div>
    )
  }
}

export default withRouter(LogInPage)
import React, { Component } from 'react';
import { Button, Panel, TextField, Dialog } from 'lucid-ui';
import { withRouter } from 'react-router-dom'


const style = {
  marginBottom: '10px',
};


class LoginPage extends Component{
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
    var letters = /^[A-Za-z1-9]+$/;

    if( !this.state.username.match(letters)){
    this.setState({ errorMessage: "Username contains special character or space! Please remove it and try again."})
      return
    }
    else if(  this.state.username.length < 3){
      this.setState({ errorMessage: "Username too short! Please make your name three characters or longer."})
        return
    }

    else if(this.state.username.length >12 ){
      this.setState({ errorMessage: "Username too long! Please make your name twelve characters or shorter."})
        return
    }

    else{

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
            localStorage.setItem("seenTutorial", true);
            this.props.setIsShown(true);

          this.props.history.push('/watch')
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({status:error.toString()});

      });
  }
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
            localStorage.setItem("seenTutorial", false);
            this.props.setIsShown(false);

        this.props.history.push('/watch')
      }

    }
    console.log("name not found")
 this.setState({ errorMessage: "Username "+currentUsername +" does not exist in the Database."});

  }


  checkNewUserHeader(){
    if(this.props.isNewUser===true){
      return "Please Create a Username";
    }
    else{
      return "Please Enter your Username Below to Log In"
    }
  }
  checkNewUserHelper(){
    if(this.props.isNewUser===true){
      return (<ul style={{float:'left',textAlign:'left'}}> <strong>Username requirements:</strong>
        <li>Only use letters and numbers (No special characters or spaces eg: !@#$% etc...).</li>
        <li>Minimum length of three characters and maximum of 12 characters.</li>
        <li>No password needed but please remember your username as it will be used to remember who voted for what video.</li>
      </ul>

    )
    }
    else{
      return
    }
  }
  checkNewUserEnter(){
    if(this.props.isNewUser===true){
      return this.signUp()
    }
    else{
      return this.logIn()
    }
  }

  checkNewUserButton(){
    if(this.props.isNewUser===true){
      return   <Button kind='primary'  onClick={()=>this.signUp()}>Sign Up</Button>

    }
    else{
      return    <Button kind='primary'  onClick={()=>this.logIn()}>Log In</Button>

    }
  }
  render() {
    if(localStorage.getItem("username")!== "" ){
        this.props.history.push('/watch')
    }

    return (
      <div>
    
        <Panel>
          <Panel.Header>
            <strong>{this.checkNewUserHeader()}</strong>
          </Panel.Header>
          <TextField
            style={style}
            placeholder='Username...'
            value={this.state.username}
            onSubmit={()=>this.checkNewUserEnter()}
            onChange={username => this.setState({ username })}
          />
          <Panel.Footer>

            {this.checkNewUserButton()}
          {this.checkNewUserHelper()}
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

export default withRouter(LoginPage)
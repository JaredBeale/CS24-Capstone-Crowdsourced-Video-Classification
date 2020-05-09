import React, { Component } from 'react';
import { Button, Panel, TextField, Dialog } from 'lucid-ui';
import { withRouter ,Redirect} from 'react-router-dom'





class LoginPage extends Component{
  constructor(props){
    super(props);
    this.logIn = this.logIn.bind(this);

    this.state = {
      username: '',
      createdUsername: '',
      listUsername: [],
      status:'',
      errorMessage:'',
    }
  }


  clearErrorMessage = () => {
    this.setState({ errorMessage: '' });
  }

  getUsernames(){
    fetch('/api/names/user/' +this.state.username.toLowerCase(), {
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
    var lowerUsername = this.state.username.toLowerCase();
    var letters = /^[A-Za-z0-9]+$/;

    if( !lowerUsername.match(letters)|| lowerUsername.length < 3){
    this.setState({ errorMessage: "Username does not meet requirements. Please try again!"})
      return
    }

    else{
    var data = {name: lowerUsername};

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
    fetch('/api/names/user/' +this.state.username.toLowerCase(), {
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
      var currentUsername = this.state.username.toLowerCase();
      if(data.length){
        console.log("Name Found! Logging in...")
        this.props.setGlobalUsername(currentUsername);
        localStorage.setItem("username", currentUsername);
        localStorage.setItem("seenTutorial", false);
        this.props.setIsShown(false);
        this.props.history.push('/watch')
      }
      else{
        console.log("name not found")
        this.setState({ errorMessage: "Username "+currentUsername +" does not exist in the Database."});
      }

    })
    .catch((error) => {
      console.error('Error:', error);
      this.setState({status:error})
    });


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
        <li>Usernames are not case sensitive.</li>
        <li>Minimum length of three characters.</li>
        <li>No password needed but please remember your username as you will need it to log back into the webste.</li>
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
      return   <Button id="signupButton" kind='primary'  style={{ padding: "20px" ,fontSize:"20px"}} onClick={()=>this.signUp()}>Sign Up</Button>

    }
    else{
      return    <Button className="loginb" id="loginButton" kind='primary'  style={{ padding: "20px" ,fontSize:"20px"}} onClick={()=>this.logIn()}>Log In</Button>

    }
  }
  render() {


    return (
      (<div>
        {(localStorage.getItem("username")!== "") && (<Redirect to="/watch" />)}

        <Panel>
          <Panel.Header>
            <strong style={{ fontSize: "20px"}}>{this.checkNewUserHeader()}</strong>
          </Panel.Header>
          <TextField
            style={{marginBottom: '10px',fontSize: "15px"}}
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
            isShown={true}
            onEscape={this.clearErrorMessage}
            handleClose={this.clearErrorMessage}
            Header='Error'
            size='small'
          >
            {this.state.errorMessage}
          </Dialog>
        }
      </div>
  )  )
}

}

export default withRouter(LoginPage)
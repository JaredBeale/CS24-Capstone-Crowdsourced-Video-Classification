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
/*
* Function Name: SignUp()
* Description: This function lets the user sign up while using regEX to make sure they use correct characters.
* Output:  Puts name into database and sends them to the video page.
*/
  signUp(){
    var lowerUsername = this.state.username.toLowerCase();
    var validLetters = /^[A-Za-z0-9]+$/;
    if( !lowerUsername.match(validLetters)|| lowerUsername.length < 3){
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
            response.json().then(info => this.setState({ errorMessage: info.content}));
          }
          else if (response.ok) {
            this.setState({status:data.success})
            this.props.setGlobalUsername(data.name);
            localStorage.setItem("username", data.name);
            localStorage.setItem("seenTutorial", true);
            this.props.setIsShown(true);
            this.props.history.push('/watch')
          }
        })
        .catch((error) => {
          this.setState({status:error.toString()});
        });
      }
    }
    /*
    * Function Name: logIn()
    * Description: This function lets the user log in and access the video page.
    * Output:  Stores the name into the local storage.
    */
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
        this.props.setGlobalUsername(currentUsername);
        localStorage.setItem("username", currentUsername);
        localStorage.setItem("seenTutorial", false);
        this.props.setIsShown(false);
        this.props.history.push('/watch')
      }
      else{
        this.setState({ errorMessage: "Username "+currentUsername +" does not exist in the Database."});
      }

    })
    .catch((error) => {
      this.setState({status:error})
    });
  }
  /*
  * Function Name: checkNewUserHeader()
  * Description: This checks if the user is new or returning to tell them if they are supposed to sign in.
  * Output:  create new user or enter user name.
  */
  checkNewUserHeader(){
    if(this.props.isNewUser===true){
      return "Please Create a Username";
    }
    else{
      return "Please Enter your Username Below to Log In"
    }
  }
  /*
  * Function Name: checkNewUserHelper()
  * Description: This checks if the user is new or returning to tell them if they are supposed to sign in.
  * Output:  empty or a description on how to sign in.
  */
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
  /*
  * Function Name: checkNewUserEnter()
  * Description: This checks if the user is new or returning to tell them if they are supposed to sign in.
  * Output:  signup or login function
  */
  checkNewUserEnter(){
    if(this.props.isNewUser===true){
      return this.signUp()
    }
    else{
      return this.logIn()
    }
  }
  /*
  * Function Name: checkNewUserButton()
  * Description: This checks if the user is new or returning to tell them if they are supposed to sign in.
  * Output:   signup or login button
  */
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
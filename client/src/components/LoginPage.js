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
  render() {
    if(localStorage.getItem("username")!== "" ){
        this.props.history.push('/watch')
    }

    return (
      <div>
      <Panel>
      <Button kind={'primary'}   onClick={()=>this.returnHome()}>Return to Home</Button>
</Panel>
        <Panel>
          <Panel.Header>
            <strong>Please Enter your Username Below to Log In</strong>
          </Panel.Header>
          <TextField
            style={style}
            placeholder='Username...'
            value={this.state.username}
            onChange={username => this.setState({ username })}
          />
          <Panel.Footer>
            <Button onClick={()=>this.logIn()}>Log In</Button>
          </Panel.Footer>
        </Panel>
        <h3 style={{color: 'red'}}>{this.state.status}</h3>
        <Panel style={{height:'500px'}}>
          <DataTable {...property}  className="UserTable"  data={this.state.listUsername}>
            <DataTable.Column field='username' align='left' width={100}>
              Usernames
            </DataTable.Column>
          </DataTable>
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
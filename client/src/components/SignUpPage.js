import _ from 'lodash';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import { DataTable, Button, Panel, TextField, Dialog } from 'lucid-ui';


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

class SignUpPage extends Component{


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
      this.setState({status:error.toString()})
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
returnHome(){
  this.props.history.push("/");
}
  render() {
    if(localStorage.getItem("username") !== "" ){
        this.props.history.push('/watch')
    }

    return (
      <div>
      <Panel>
      <Button kind={'primary'}   onClick={()=>this.returnHome()}>Return to Home</Button>
</Panel>
        <Panel>
          <Panel.Header>
            <strong>Please Create a Username</strong>
          </Panel.Header>
          <TextField
            style={style}
            placeholder='Username...'
            value={this.state.username}
            onChange={username => this.setState({ username })}
          />
          <Panel.Footer>
            <Button onClick={()=>this.signUp()}>Sign Up</Button>
          </Panel.Footer>
        </Panel>
        <h3 style={{color: 'green'}}>{this.state.status}</h3>
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

export default withRouter(SignUpPage);

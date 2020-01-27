import React, { Component} from 'react';
import { LoadingIndicator, LoadingIcon,  SearchableSingleSelect } from 'lucid-ui';
import {DataTable, Tabs, Button, Panel,CheckIcon,TextField } from 'lucid-ui';



const style = {
  marginBottom: '10px',
};

class LoginPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      createdUsername: '',
      listUsername: []
    }
  }
  componentDidMount(){
this.getUsernames();
  }

getUsernames(){
  fetch('/api/names/users', {
method: 'GET',
headers: {
  'Content-Type': 'application/json',
},

}).then((response) => response.json())
.then((data) => {
var listedUsernames = []
for(var i = 0; i < data.length; i++){
  listedUsernames.push({"username":data[i]});
}
console.log(listedUsernames);
this.setState({listUsername:listedUsernames});
})
.catch((error) => {
console.error('Error:', error);
});
}


  signUp(){
    var data = {name: this.state.username};
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
  console.log(data);
  this.getUsernames();

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
              <strong>Please Create a Username or Log In </strong>
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

                <Button onClick={()=>this.signUp()}>Sign Up</Button>
            </Panel.Footer>
          </Panel>
          <DataTable data={this.state.listUsername}>
               <DataTable.Column field='username' align='left'>
                 Usernames
               </DataTable.Column>
               </DataTable>
          </div>
      )
  }
}
export default LoginPage;




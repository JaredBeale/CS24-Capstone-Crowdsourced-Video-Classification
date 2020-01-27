import React, { Component} from 'react';
import { LoadingIndicator, LoadingIcon,  SearchableSingleSelect } from 'lucid-ui';
import {DataTable, Tabs, Button, Panel,CheckIcon,TextField } from 'lucid-ui';



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
class LoginPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      createdUsername: '',
      listUsername: [],
      status:'',
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

this.setState({listUsername:listedUsernames.reverse()});
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
  this.setState({status:data.success})
  this.getUsernames();

})
.catch((error) => {
  console.error('Error:', error);
  this.setState({status:error})

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
          <h3 style={{color: 'green'}}>{this.state.status} </h3>
  <Panel style={{height:'500px'}}>

          <DataTable {...property}  className="UserTable"  data={this.state.listUsername}>
               <DataTable.Column field='username' align='left' width={100}>
                 Usernames
               </DataTable.Column>
               </DataTable>
  </Panel>
          </div>
      )
  }
}
export default LoginPage;




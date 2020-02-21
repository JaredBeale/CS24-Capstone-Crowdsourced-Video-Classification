import React, { Component} from 'react';
import { Button, Dialog,CheckIcon } from 'lucid-ui';
import { withRouter } from 'react-router-dom'

// with an increase of <span style={{fontSize: "1.8em"}}>{Number(seshCount/(totalLabels-seshCount)*100).toFixed(1)}%</span>
 class ExitPageModal extends Component{

   constructor(props){

     super(props);


     this.state = {
       isShown: true,

     };


   }

  handleShow(isShown) {
    this.setState({ isShown:isShown });
  }
  handleConfirm() {
    this.props.setGlobalUsername("");
    this.props.setBannerExit(false);
    this.props.history.push('/login');
  }
  render() {
    const totalLabels = this.props.totalCount;
    const username = localStorage.getItem("username");
    const seshCount = sessionStorage.getItem("sessionVoteCount");

    return (
      <div style={{fontSize: "2em", font: "menu"}}>


        <Dialog
          isShown={this.state.isShown}
          onClick={ ()=>{this.handleShow(!this.state.isShown)}}
          Header='See you Later!'
          size="medium"

        >
          <div key={'info'} >
            <p style={{fontSize: "1.5em",lineHeight: "1.6"}}>
              Glad you could work on some of these videos, {username}. We really appreciate your help. Come visit us again!
            </p>
            <p style={{fontSize: "1.5em",lineHeight: "1.6"}}>
              During this past session you reviewed <span style={{fontSize: "1.5em"}}>+{seshCount}</span> clip(s).
              You now have a total of <span style={{fontSize: "1.5em"}}>{totalLabels}</span> submissions.
            </p>
          </div>

          <Dialog.Footer>
            <Button
              kind='primary'
              onClick={ ()=>{this.handleConfirm()}}
              style={{ marginRight: '9px' }}
            >
              <CheckIcon />OK, Return to Login Page
            </Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  }
}export default withRouter(ExitPageModal);

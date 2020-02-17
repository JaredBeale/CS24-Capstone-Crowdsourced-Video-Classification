import _ from 'lodash';
import React from 'react';
import createClass from 'create-react-class';
import { Button, Dialog,CheckIcon } from 'lucid-ui';


export default createClass({
  getInitialState() {
    return {
      isShown: true,
    };
  },

  handleShow(isShown) {
    this.setState({ isShown });
  },

  render() {
    const totalLabels = this.props.totalCount;
    const username = localStorage.getItem("username");
    const seshCount = sessionStorage.getItem("sessionVoteCount");

    return (
      <div style={{fontSize: "2em", font: "menu"}}>
        <Button onClick={_.partial(this.handleShow, !this.state.isShown)}>
          O
        </Button>

        <Dialog
          isShown={this.state.isShown}
          handleClose={_.partial(this.handleShow, !this.state.isShown)}
          Header='See you Later!'
          size="medium"

        >
          <div key={'info'} >
            <p style={{fontSize: "1.5em",lineHeight: "1.6"}}>
              Glad you could work on some of these videos, {username}.
            </p>
            <p style={{fontSize: "1.5em",lineHeight: "1.6"}}>
              During this past session you reviewed <span style={{fontSize: "1.8em"}}>+{seshCount}</span> clip(s).
              You now have a total of <span style={{fontSize: "1.8em"}}>{totalLabels}</span> submissions with an
              increase of <span style={{fontSize: "1.8em"}}>{Number(seshCount/(totalLabels-seshCount)*100).toFixed(1)}%</span>
            </p>
          </div>

          <Dialog.Footer>
            <Button
              kind='primary'
              onClick={_.partial(this.handleShow, false)}
              style={{ marginRight: '9px' }}
            >
              <CheckIcon />OK
            </Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  },
});

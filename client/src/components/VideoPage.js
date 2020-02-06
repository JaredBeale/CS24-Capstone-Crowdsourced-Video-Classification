import React, { Component} from 'react';
import Player from "./VideoPlayer";
import { LoadingIndicator, LoadingIcon } from 'lucid-ui';
import {Dialog, Button, CheckIcon } from 'lucid-ui';
import { withRouter } from 'react-router-dom'

import LabelSelect from "./LabelSelect.js"


const {
  LoadingMessage,
} = LoadingIndicator;




class VideoPage extends Component{
  constructor(props){

    super(props);


    this.state = {
      videoChosen: false,

      labelsLoaded: false,
      chosenLabel: null
    };

    this.onSelectChange = this.onSelectChange.bind(this);
    this.submitLabel = this.submitLabel.bind(this);
  }
  componentDidMount(){
    this.loadLabels();
    this.askForClip();

  }
  onSelectChange(value){
    this.setState({
      chosenLabel: this.state.labels[value]
    });
  }


  renderSelect(){

    return(
      <div id="select-div">

        <LabelSelect
          labels={this.state.labels}
          onchange={this.onSelectChange}
          />

          <Button id="submit-label-button" onClick={this.submitLabel} size="large"><CheckIcon />Save and Refresh</Button>

      </div>
    )
  }

  render(){
    if(localStorage.getItem("username")=== "" ){
        this.props.history.push('/login')
    }

    return (
    <div className="outer">
      <div className="middle">
            <div id="video-page-container" className="inner">

              {!this.state.videoChosen && <LoadingIndicator style={{marginLeft:"150px"}} isLoading={!this.state.videoChosen}>
                  <LoadingMessage
                  style={{marginLeft:"150px"}}
                      Icon={<LoadingIcon speed='fast' />}
                      Title='Selecting data from DB...'
                      Body='Please wait'
                    />

                  </LoadingIndicator>}

                                           <Dialog
                                             isShown={this.props.isShown}
                                             onEscape={()=>this.props.handleShow()}
                                             onBackgroundClick={()=>this.props.handleShow()}
                                             handleClose={()=>this.props.handleShow()}
                                             Header='Tutorial'
                                             size='small'
                                           >
                                             <div key={'info'}>
                                                <h3>  Video Watching Page Instructions</h3>
                                                <li>  Please select the most appropriate emotion label based
                                                        on what you think the emotion
                                                        the video is conveying and if you can’t decide select neutral.</li>
                                                <li>  Click ‘save & refresh’ to submit
                                                        your answer and view another video.</li>
                                                <li>    View and vote on as many videos you desire.</li>
                                                <li>    You may exit or log out at any time.</li>
                                             </div>

                                             <Dialog.Footer>

                                               <Button
                                                  onClick={()=>this.props.handleShow()}
                                                  kind='primary'>Got it!</Button>
                                             </Dialog.Footer>
                                           </Dialog>


                  {this.state.videoChosen && <Player
                                          url={this.state.video} />}
                {this.state.labelsLoaded && this.state.labels && this.renderSelect()}
              <div>



                </div>
              </div>
        </div>
      </div>
      )
  }






  submitLabel(){
    // in this case we need self.
    const self=this;
    const pastLabels = self.state.labels;

    if(this.state.chosenLabel){
      console.log(this.state.chosenLabel);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/create/vote`, true);
      xhr.setRequestHeader("Content-Type", "application/json");


      xhr.onreadystatechange = function() { // Call a function when the state changes.
          if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
              // Request finished. Do processing here.
              // this is not THIS in t
              self.setState({
                videoChosen: false,
                video: null,
                labels: pastLabels
              })
              self.askForClip();
          }
          else if (this.readyState === XMLHttpRequest.DONE) {
            alert("post failed, try again later when you are logged in or something.");
          }

      }
      self.setState({
        labels: null
      })
      // brings the user from the props
      // and the other stuff from the current site.
      const data = {
        user: this.props.globalUsername,
        label: this.state.chosenLabel,
        video: this.state.videoid
      }
      xhr.send(JSON.stringify(data));
    }

  }

  askForClip(){
    const self = this;
    fetch('/api/videos/select/username/' + this.props.globalUsername, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (!response.ok) {
        self.setState({
          video: "https://www.youtube.com/watch?v=G7RgN9ijwE4&list=PLysK5kM8r78sJFo--opGDHCdTgNJTIb-o",
          videoid: null,
          videoChosen: true
        });
      }
      return response.json();
    }).then((data) => {
      self.setState({
        video: data.url,
        videoid: data.fileid,
        videoChosen: true
      })
      return;
    })
    .catch((error) => {
      console.error('Error:', error);
      // default video
      self.setState({
        video: "https://www.youtube.com/watch?v=G7RgN9ijwE4&list=PLysK5kM8r78sJFo--opGDHCdTgNJTIb-o",
        videoid: null,
        videoChosen: true
      });
    });
  }


  loadLabels(){
    const self = this;
    fetch('/api/names/labels', {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (!response.ok) {
          self.setState({
            labels: ["Server Error.","Try","again","later","optiona",],
            labelsLoaded: true
          })
      }
      return response.json();
    }).then((data) => {
      console.log("we are fine:",data);
      self.setState({
        labels: data,
        labelsLoaded: true
      })
    })
    .catch((error) => {
      console.error('Error:', error);
      this.setState({
        labels: ["other error client reach","Try","again","later","optiona"],
        labelsLoaded: true
      });
    });
  }

}
export default withRouter(VideoPage);

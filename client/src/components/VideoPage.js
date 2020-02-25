import React, { Component} from 'react';
import Player from "./VideoPlayer";
import { LoadingIndicator, LoadingIcon,RadioGroup  } from 'lucid-ui';
import {Dialog,Button, CheckIcon } from 'lucid-ui';
import { withRouter, Redirect } from 'react-router-dom'

const style = {
  marginRight: '13px',
};

const {
  LoadingMessage,
} = LoadingIndicator;




class VideoPage extends Component{
  constructor(props){
    var sessionVoteCount = sessionStorage.getItem("sessionVoteCount");

    if (sessionVoteCount === null) {
      sessionVoteCount = "0";
      sessionStorage.setItem("sessionVoteCount", sessionVoteCount);
    }
    var numSessionVoteCount = parseInt(sessionVoteCount,10);


    super(props);


    this.state = {
      videoChosen: false,
      labelsLoaded: false,
      LabelIndex: -1,
      labels: [],
      playing: false,
      playpauseString: "Play",
      player: null,
      voteCount: 0,
      sessionVoteCount: numSessionVoteCount,
      time2exit: false,

    };

    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.submitLabel = this.submitLabel.bind(this);

  }
  componentDidMount(){
    this.loadVideosVoted();
    this.loadLabels();
    this.askForClip();

  }
  loadVideosVoted(){
    fetch('/api/votes/count/' + this.props.globalUsername, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      },
    }).then((response) => {
        if (response.status === 400) {
          console.log('failure');
        }
        else if (response.ok) {
          console.log('success');
          return response.json();

        }
      }).then((data) => {
      console.log(data);
      this.setState({voteCount:data});
      })
      .catch((error) => {
        console.log(error);

      });
  }

  onSelectChange(e){
    console.log(e)
    this.setState({
      LabelIndex: e
    });
  }


  renderSelect(){
    const listLabels = this.state.labels.map((label)=>
    <RadioGroup.RadioButton  key={"label-"+label} style={style}>
   <RadioGroup.Label>{label}</RadioGroup.Label>
   </RadioGroup.RadioButton>
   )
    return(
      <div id="select-div">
      <span id="container-selction">
      <RadioGroup
             name='name'
             selectedIndex={this.state.LabelIndex}
             onSelect={this.onSelectChange}
             style={{
               display: 'inline-flex',
               flexDirection: 'column',
             }}
           >

        {listLabels}

        </RadioGroup>
<span>
<h4 id="sessioncount">Videos classified this session: {this.state.sessionVoteCount}</h4>

        <Button id="submit-label-button" onClick={this.submitLabel}
          isDisabled={this.state.LabelIndex===-1} size="large">
            <CheckIcon />Save and Continue
        </Button>
        <Button id="submit-label-button" isDisabled={this.state.LabelIndex===-1}
          onClick={()=>{
            this.submitLabel();
            this.setState({
              time2exit: true
            })
          }} size="large">
            <CheckIcon />Save and Exit
        </Button>

</span>
</span>
      </div>
    )
  }

  render(){
    if(localStorage.getItem("username")=== "" ){
        this.props.history.push('/login')
    }

    return (
    <div className="outer">
    {this.state.time2exit && <Redirect to="/goodbye" />}
      <div className="middle">
            <div id="video-page-container" className="inner">



                     <Dialog
                       isShown={this.props.isShown}
                       onEscape={()=>this.props.handleShow()}
                       onBackgroundClick={()=>this.props.handleShow()}
                       handleClose={()=>this.props.handleShow()}
                       Header='Video Watching Page Instructions'
                       size='medium'
                     >
                       <div key={'info'}>

                    <ol>
                       <li>  Watch the video displayed on the screen.</li>
                       <li>  Select the most appropriate <strong>emotion the video is conveying.</strong> If you are unsure select "Neutral".</li>
                       <li>  Click 'Save and Continue' to move on to the next video.</li>
                       <li>  Click 'Save and Exit' to submit and end your session.</li>
                       <li>  View and vote on as many videos as you like.</li>
                       <li>  You may exit or log out at any time.</li>
                       <li>  To reopen this helpful dialog, click green 'Help' button in the upper right at any time"</li>
                    </ol>
                       </div>

                       <Dialog.Footer>

                         <Button
                            onClick={()=>this.props.handleShow()}
                            kind='primary'>Got it!</Button>
                       </Dialog.Footer>
                     </Dialog>



<div id="video-form">
{!this.state.videoChosen &&  <LoadingMessage  Icon={<LoadingIcon speed='fast' />}
  Title='Selecting data from DB...'
  Body='Please wait' isLoading={!this.state.videoChosen}>





    </LoadingMessage>}
                    {this.state.videoChosen && <Player
                      playpauseString={this.state.playpauseString}
                      handlePlayPause={this.handlePlayPause}
                      url={this.state.video}
                      liftUpRef={(val) => {console.log(val);this.setState({player: val});}}
                      handleProgress={this.handleProgress}
                      playing={this.state.playing}/>}

                    {this.state.videoChosen &&
                      this.state.labelsLoaded &&
                        this.state.labels && this.renderSelect()}

</div>
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

    if(this.state.labels[self.state.LabelIndex]){
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
                LabelIndex: -1,
              })
              var sessionVoteCount = sessionStorage.getItem("sessionVoteCount");

              if (sessionVoteCount === null) {
                sessionVoteCount = "0";
                sessionStorage.setItem("sessionVoteCount", sessionVoteCount);
              }

              var numSessionVoteCount = parseInt(sessionVoteCount,10);
              numSessionVoteCount++;
              self.setState({sessionVoteCount:numSessionVoteCount})
              sessionStorage.setItem("sessionVoteCount", numSessionVoteCount);

              self.askForClip();
          }
          else if (this.readyState === XMLHttpRequest.DONE) {
            self.setState({
              videoChosen: false,
              video: null,
              LabelIndex: -1
            });
            self.askForClip();
          }
      }

      // brings the user from the props
      // and the other stuff from the current site.
      const data = {
        user: this.props.globalUsername,
        label: self.state.labels[self.state.LabelIndex],
        video: this.state.videoid
      }
      xhr.send(JSON.stringify(data));
    }
this.loadVideosVoted();

  }
  handlePlayPause(){
    if(this.state.played!== 1){
      const nextStr = this.state.playing ? "Play" : "Pause";
      this.setState(function(prev){
        return {
          playing: !prev.playing,
          playpauseString: nextStr
        }
      })
    }
    else{
      this.setState({
        playing: true,
        playpauseString: "Pause"
      });
      this.state.player.seekTo(0)

    }
  }
  handleProgress(stuff){
    console.log(stuff.played);
    if(stuff.played === 1 ){
      this.setState({
        played: stuff.played,
        playpauseString: "Restart"
      })
    }
    else{
      this.setState({
        played: stuff.played,
      })

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

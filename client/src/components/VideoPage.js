import React, { Component} from 'react';
import Player from "./VideoPlayer";
import { LoadingIndicator, LoadingIcon,RadioGroup  } from 'lucid-ui';
import {Dialog,Button, CheckIcon } from 'lucid-ui';
import { withRouter, Redirect } from 'react-router-dom'

const style = {
  marginRight: '13px',
};

const { LoadingMessage} = LoadingIndicator;



class VideoPage extends Component{
  constructor(props){
    let sessionVoteCount = sessionStorage.getItem("sessionVoteCount");
    if (sessionVoteCount === null) {
      sessionVoteCount = "0";
      sessionStorage.setItem("sessionVoteCount", sessionVoteCount);
    }


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
      sessionVoteCount: parseInt(sessionVoteCount,10),
      time2exit: false,
      errorMessage:'',


    };
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
    })
    .then((response) => {
        if (response.status === 400) {
          console.log('failure loading user count data');
        }
        else if (response.ok) {
          return response.json();

        }
      })
      .then((data) => {
        this.setState({voteCount:data});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onSelectChange(e){
    this.setState({
      LabelIndex: e
    });
  }

  // Ties the value of the form to the state of the class, and not
  // the radio group component.

  /* the renderSelect is actually the entire form with the submit buttons. i changed it to the name.
  * includes:
  * radio button group of labelsLoaded
  * save and continue Button
  * save and exit button
  */
  renderLabelForm(){
    const listLabels = this.state.labels.map(
      (label)=>
        (
          <RadioGroup.RadioButton  key={"label-"+label} style={style}>
            <RadioGroup.Label>{label}</RadioGroup.Label>
          </RadioGroup.RadioButton>
        )
      );
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
          <div>
            <h4 id="sessioncount">Videos classified this session: {this.state.sessionVoteCount}</h4>
            <Button id="submit-continue-label-button" onClick={this.submitLabel}
              isDisabled={this.state.LabelIndex===-1} size="large">
              <CheckIcon />Save and Continue
            </Button>
            <Button id="submit-exit-label-button" isDisabled={this.state.LabelIndex===-1}
              onClick={()=>{
                this.submitLabel();
                this.props.setGlobalUsername("");
                this.props.setBannerExit(false);
                this.setState({
                  time2exit: true
                })
              }} size="large">
              <CheckIcon />Save and Exit
            </Button>
          </div>
        </span>
      </div>
    )
  }

  render(){
    var redirect = false;
    //There are multiple redirects, to prevent them
    // from both being rendered, we will use if else.
    // on the singout button on the top right it gets bugged with the  !this.props.usernamethign
    if(this.state.time2exit || !this.props.globalUsername){
      redirect = (<Redirect to="/goodbye" />);
    }
    else if((localStorage.getItem("username")=== "")){
      redirect =  (<Redirect to="/login" />);
    }

    return (
      <div id="video-page-container" className="inner">
            {redirect!==false && redirect}
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

                  {/* This is the loading spinner that replaces the
                  video player widget. it is replaced with videoChosen==true
                  -- lozzoc*/}
                  {!this.state.videoChosen
                    &&  <LoadingMessage
                          Icon={<LoadingIcon speed='fast' />}
                          Title='Selecting data from DB...'
                          Body='Please wait'
                          isLoading={!this.state.videoChosen}>
                    </LoadingMessage>}
                  {/*
                    this contains the duration indicator and the video player
                  */}
                    {this.state.videoChosen && <Player
                      playpauseString={this.state.playpauseString}
                      handlePlayPause={this.handlePlayPause}
                      url={this.state.video}
                      liftUpRef={(val) => {console.log(val);this.setState({player: val});}}
                      handleProgress={this.handleProgress}
                      playing={this.state.playing}/>}

                  {/* In the html, the select component is not even there
                    until the videoID/ videoURL is  chosen. which prevents malicious use
                    of cross-site scripting... i think. -- lozzoc
                  */}
                    {this.state.videoChosen &&
                      this.state.labelsLoaded &&
                        this.state.labels && this.renderLabelForm()}
                        {this.errormessage()}
                  </div>  {/* end video form*/}
            {/* end video page*/}
            </div>
          );

    }

    errormessage(){
      if(this.state.errorMessage !== ''){
          if(this.state.errorMessage === "This labeling task has no more videos to watch. There are no more videos to vote on, please log out."){
            return (
                <Dialog
                  isShown='true'
                  Header='No more videos to vote on, please log out'
                  size='small'
                >
                  {this.state.errorMessage}
                  <Dialog.Footer>
                  <Button onClick={this.props.setBannerExit} kind='primary'>Logout</Button>
                  </Dialog.Footer>

                </Dialog>
              )
          }
          else{
        return (
            <Dialog
              isShown='true'
              Header='Server Error'
              size='small'
            >
              {this.state.errorMessage}
            </Dialog>
          )
        }
      }
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
              self.setState({
                videoChosen: false,
                video: null,
                LabelIndex: -1,
              })

              // this code is reused elsewhere i think on page load as well. if it happens in the constructor-super
              // then all we can assume its at least "0" or greater.
              var sessionVoteCount = sessionStorage.getItem("sessionVoteCount");
              ////////
              if (sessionVoteCount === null) {
                sessionVoteCount = "0";
                sessionStorage.setItem("sessionVoteCount", sessionVoteCount);
              }
              ///////
              var numSessionVoteCount = parseInt(sessionVoteCount,10);
              // var numSessionVoteCount = parseInt(sessionStorage.getItem("sessionVoteCount"),10)
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

  clearErrorMessage = () => {
    this.setState({ errorMessage: '' });
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
        response.json().then(info => this.setState({ errorMessage: info.content+" There are no more videos to vote on, please log out."}));

      }
      return response.json();
    }).then((data) => {

      /* at this point we change the video and the video player updates as well */
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
        video: null,
        videoid: null,
        videoChosen: false
      });
      this.setState({ errorMessage: "Server had an error: [" + error.toString() +"]. Please refresh and try again."});
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

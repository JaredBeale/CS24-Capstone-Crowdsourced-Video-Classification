import React, { Component} from 'react';
import Player from "./VideoPlayer";
import { LoadingIndicator, LoadingIcon,  SearchableSingleSelect } from 'lucid-ui';
import { Button, CheckIcon } from 'lucid-ui';
import { withRouter } from 'react-router-dom'


const {
  LoadingMessage,
} = LoadingIndicator;

const { Option } = SearchableSingleSelect;


// const AWS_FILE_NAME ="sticky-bottom.mp4";

// var gdrive_uri = `http://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;
// var aws_uri =`https://quick-start-xandr-videohost.s3.amazonaws.com/${AWS_FILE_NAME}`;



class VideoPage extends Component{
  constructor(props){


    super(props);
    this.state = {
      videoChosen: false,
      video: {
        fname:"LukeRaisesxwing.mp4",
        url: "https://www.youtube.com/watch?v=to3OFgBcQvg"
      },
      labelsLoaded: false,
      labels: ["optiona","optionb","optionc","optiond","optione",],
    }
  }
  componentDidMount(){
    // url GET to api to choose a video based on name.
    const self = this;
    window.setTimeout(function(){
      self.setState({
        videoChosen:true
      })
    },1250);
    window.setTimeout(function(){
      self.setState({
        labelsLoaded:true
      })
    },500);
  }
  signOut(){
    this.props.setGlobalUsername("");

    localStorage.setItem("username", "");
    this.props.history.push('/')

  }
  renderSelect(){

    return(
      <div id="select-div">
        <SearchableSingleSelect
                    SearchField={{ placeholder: 'Label' }}
                    style={{ maxWidth: '500px' }}
                    size="large"
                  >
                    {this.state.labels.map(function(value){
                      return (<Option key={`label-${value}`}>
                                {value}
                              </Option>)

                    })}

                  </SearchableSingleSelect>
          <Button id="submit-label-button" size="large"><CheckIcon />Save and Refresh</Button>
      </div>
    )
  }
  render(){
    if(localStorage.getItem("username")=== "" ){
        this.props.history.push('/')
    }

    return (
    <div className="outer">
      <div className="middle">
            <div id="video-page-container" className="inner">

                <LoadingIndicator isLoading={!this.state.videoChosen}>
                  <LoadingMessage
                      Icon={<LoadingIcon speed='fast' />}
                      Title='Selecting data from DB...'
                      Body='Please wait'
                    />
                  <div>current user:{this.props.globalUsername}</div>
                  <Button onClick={()=>this.signOut()}>Sign Out</Button>


                  </LoadingIndicator>
                  {this.state.videoChosen && <Player
                                          commonName={this.state.video.fname}
                                          url={this.state.video.url} />}
                {this.state.labelsLoaded && this.renderSelect()}
              <div>



                </div>
              </div>
        </div>
      </div>
      )
  }
}
export default withRouter(VideoPage);




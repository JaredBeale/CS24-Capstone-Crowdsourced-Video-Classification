import React, { Component} from 'react';

import Player from "./VideoPlayer"

// const AWS_FILE_NAME ="sticky-bottom.mp4";

// var gdrive_uri = `http://drive.google.com/uc?export=download&id=${DRIVE_FILE_ID}`;
// var aws_uri =`https://quick-start-xandr-videohost.s3.amazonaws.com/${AWS_FILE_NAME}`;
const aws_uri = "https://www.youtube.com/watch?v=to3OFgBcQvg";



class VideoPage extends Component{
  render(){
    return (
    <div id="video-page-container">
      <Player commonName={"Luke Raises x-wing"} url={aws_uri} />
      <h1>This will be a form</h1>
    </div>)
  }
}
export default VideoPage;

import React from 'react';
import ReactPlayer from "react-player";
import {LoadingMessage,LoadingIcon,Button} from 'lucid-ui';


class VideoPlayer extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      url: null,
      pip: false,
      playing: props.isPlaying,
      controls: false,
      light: false,
      volume: 0.8,
      muted: false,
      played: 0,
      loaded: 0,
      duration: Infinity,
      playbackRate: 1.0,
      loop: false,
      playpauseString: "Play",

    }
    this.url = props.url;
  }


  load = url => {
    this.setState({
      url,
      played: 0,
      pip: false
    })
  }
  ref = player => {
    this.player = player
  }

  componentDidMount(){
    this.load(this.url);
    this.setDurration();
    this.props.liftUpRef(this.player);
  }




  setDurration(){

    const self = this;
    if(this.player !== null){

    const time = this.player.getDuration();

    if(!time){
     window.setTimeout(function(){
      self.setDurration();

     },999)
    }
    else{
      self.setState({
        duration: time
      })
    }
  }

}

  render(){
    var {  url} = this.state



      return (
        <div id="video-player-widget">

            <div id="video" >

              <span><h1>Duration: {this.state.duration === Infinity ?  <LoadingMessage

                    Icon={<LoadingIcon speed='slow' />}
                    Title='Loading...'

                  />

                : this.state.duration.toFixed(2)} {this.state.duration === Infinity ? "": "sec"}</h1></span>

              <ReactPlayer
                ref={this.ref}
                onProgress={this.props.handleProgress}
                onStart={() => console.log('onStart')}
                playing={this.props.playing}
                url={url}
                controls
                width	={832}
                height	={468}
                config={{file:{
                  attributes:{
                    controlsList: "nodownload",
                    disablePictureInPicture: true,
                  }
                }}}


              />
            

            </div>

        </div>
      );
    }



}


export default VideoPlayer

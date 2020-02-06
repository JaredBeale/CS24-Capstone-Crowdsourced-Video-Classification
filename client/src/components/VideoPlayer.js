import React from 'react';
import ReactPlayer from "react-player";
import {LoadingMessage,LoadingIcon} from 'lucid-ui';


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

    }

    this.url = props.url;
  }
  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false
    })
  }
  ref = player => {
    this.player = player
  }

  componentDidMount(){
    this.load(this.url);
    this.setDurration();
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
      console.log("Video length: ",time)

      self.setState({
        duration: time
      })

    }
  }

}

  render(){
    var { playing , url,} = this.state



      return (
        <div id="video-player-widget">

            <div id="video" >

              <span><h1>Duration: {this.state.duration === Infinity ?   <LoadingMessage

                    Icon={<LoadingIcon speed='slow' />}
                    Title='Loading...'

                  />

                : this.state.duration.toFixed(2)}</h1></span>

              <ReactPlayer
                ref={this.ref}
                onProgress={this.handleProgress}
                onStart={() => console.log('onStart')}
                playing={playing}
                url={url}
                controls
                width	={832}
                height	={468}


              />
            </div>

        </div>
      );
    }



}


export default VideoPlayer

import React from 'react';
import ReactPlayer from "react-player";
import { Button} from 'lucid-ui';



class App extends React.Component {

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
      loop: false
    }
    this.handlePlayPause = this.handlePlayPause.bind(this);
    // this.handleProgress = this.handleProgress.bind(this);
    this.restartVideo = this.restartVideo.bind(this);
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
  handlePlayPause(){
    this.setState({ playing: !this.state.playing })
  }

  restartVideo(){
     this.player.seekTo(0)
  }


  setDurration(){
    const self = this;
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
      // window.setTimeout(function(){
      //   self.setDurration();

      //  },999)
    }
  }


  render(){
    var { playing , url,} = this.state



      return (
        <div id="video-player-widget">

            <div id="video" >

              <span><h1>-- Seconds: {this.state.duration}</h1></span>


              <ReactPlayer
                ref={this.ref}
                onProgress={this.handleProgress}
                onStart={() => console.log('onStart')}
                playing={playing}
                url={url}
              />
            </div>
            <div id="video-controls">
              <Button size="large" onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</Button>
              <Button size="large" onClick={this.restartVideo}>Restart</Button>

            </div>



        </div>
      );
    }



}


export default App

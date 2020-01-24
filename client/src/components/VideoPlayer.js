import React from 'react';
import ReactPlayer from "react-player";



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
      duration: 0,
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
  }
  // handleProgress(state){
  //   console.log('onProgress', state)
  //   // We only want to update time slider if we are not currently seeking
  //   if (!this.state.seeking) {
  //     this.setState(state)
  //   }
  // }

  handlePlayPause(){
    this.setState({ playing: !this.state.playing })
  }
  restartVideo(){
     this.player.seekTo(0)
  }


  render(){
    console.log(ReactPlayer.canPlay('static/v2-in-the-butt-bender.mp4'));
    var { playing , url,} = this.state



      return (
        <div id="video-player-widget">

            <div id="video" >
            <h1>{this.props.commonName}</h1>
              <ReactPlayer
                ref={this.ref}
                onProgress={this.handleProgress}
                onReady={() => console.log('onReady')}
                onStart={() => console.log('onStart')}
                playing={playing}
                url={url}
              />
            </div>
            <div id="video-controls">
              <button onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
              <button onClick={this.restartVideo}>Restart</button>

            </div>



        </div>
      );
    }



}


export default App

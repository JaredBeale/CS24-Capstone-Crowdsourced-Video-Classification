import React from 'react';
import ReactPlayer from "react-player";
import {LoadingMessage,LoadingIcon} from 'lucid-ui';

/*
*
* The video player wiget has two pieces: the player itself and the duration text.
* the player has native controls enabled in this component, but really
* the only button that is used is the replay button.
*/
class VideoPlayer extends React.Component {

  constructor(props){
    super(props);
    this.url = props.url;
    this.state = {
      playing: props.isPlaying,
      url: null,
      pip: false,
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




  /*The duration element is away for users to ge a sense
  * of how long the videos are. and to prepare the labeling task.
  * inputs: none
  * outputs: recursive function that pings the filesize every 1 second
  *         until the size is availible.
  */
  setDurration(){
    const self = this;
    if(this.player !== null){
      const time = this.player.getDuration();
      if(!time){
        window.setTimeout(function(){
          self.setDurration();
          return;
        },
        999);
      }
      else {
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
              <span>
                <h1>Duration:
                  {this.state.duration === Infinity ?
                    <LoadingMessage
                      Icon={<LoadingIcon speed='slow' />}
                      Title='Loading...'
                    />  : `${this.state.duration.toFixed(2)} sec`}
                </h1>
              </span>
              <ReactPlayer
                className="react-player"
                ref={this.ref}
                onProgress={this.props.handleProgress}
                onStart={() => console.log('onStart')}
                playing={this.props.playing}
                url={url}
                controls
                width	='100%'
                height	='100%'
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

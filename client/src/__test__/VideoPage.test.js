import React from 'react';
import { mount, shallow, render } from 'enzyme';

import { MemoryRouter as Router} from 'react-router-dom' // 4.0.0
import { RadioGroup  } from 'lucid-ui';
import {Button, CheckIcon } from 'lucid-ui';
import VideoPage from "../components/VideoPage.js"


class RenderSelect extends React.Component{
  state = { video: "https://crowd-source-circuit-tv.s3-us-west-1.amazonaws.com/dev_splits_complete/dia109_utt1.mp4",
    videoChosen: true,
    labelsLoaded: true,
    LabelIndex: -1,
    labels: ["Undecided","Undecided1","Undecided2"],

  }
  render(){
      const listLabels = this.state.labels.map(
        (label)=>
          (
            <RadioGroup.RadioButton  key={"label-"+label} >
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
            <span>
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
            </span>
          </span>
        </div>
      )
  }

}

/*https://enzymejs.github.io/enzyme/docs/api/ReactWrapper/setState.html
const wrapper = mount(<Foo />);
wrapper.setState({ name: 'bar' });
expect(wrapper.find('.bar')).to.have.lengthOf(1);

https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/dive.html
const wrapper = shallow(<Foo />);]
expect(wrapper.find(Bar).dive().find('.in-bar')).to.have.lengthOf(1);

*/
describe('Sign in behavior on video page', () => {
  it('should redirect to goodbye page, when globalusername is null', () => {
    const wrapper = mount(<Router initialEntries={[ '/watch' ]}><VideoPage
                              setBannerExit={()=>{}}
                              handleShow={false}
                              isShown={false}
                              setGlobalUsername={false}
                              globalUsername={false}/></Router>);

    expect(wrapper.find('Router')
    .prop('history').location.pathname)
    .toEqual("/goodbye")


    wrapper.unmount();
  });
});

describe("Submit/continue buttons before Label cast ",()=>{


  it('Form should not be present until video is chosen.', () => {

    // initial render the label value is null, and the buttons are not there, check.
    const wrapper = mount(<Router initialEntries={[ '/watch' ]}><VideoPage
                              setBannerExit={()=>{}}
                              handleShow={false}
                              isShown={false}
                              setGlobalUsername={(e)=>{console.log(e)}}
                              globalUsername={"lozzoc"}/></Router>
                            );


    // wrapper.find('withRouter(VideoPage)').setState({
    //   video: "https://crowd-source-circuit-tv.s3-us-west-1.amazonaws.com/dev_splits_complete/dia109_utt1.mp4",
    //   videoChosen: true,
    //   labelsLoaded: true,
    //   labels: ["Undecided"],
    //
    // });

    expect(wrapper.find("#submit-continue-label-button"))
    .toEqual({});
    wrapper.unmount();
  });


  it('Should not be able to submit w/out a label chosen, but have watched video', () => {

    const sh =  mount(<RenderSelect />)


    // by checking the buttons props of disabled we can verify this.
    // this is before labeling but after the video loads
    const arr = sh.find("button").filter(function(button){
      return button.prop("disabled") === true;
    });
    expect(arr.length).toEqual(sh.find("button").length);
    // sh.unmount();

  });
  // expect("button")
  // .toEqual("disabled")


})

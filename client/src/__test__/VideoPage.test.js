import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { MemoryRouter as Router, withRouter } from 'react-router-dom' // 4.0.0
import VideoPage from "../components/VideoPage.js"


describe('Apps global username (not the local storage cookie) set to null', () => {
  it('should redirect to goodbye page', () => {
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


  it('Should not be able to submit w/out labels', () => {

    // initial render the label value is null.
    const wrapper = shallow(<Router initialEntries={[ '/watch' ]}><VideoPage
                              setBannerExit={()=>{}}
                              handleShow={false}
                              isShown={false}
                              setGlobalUsername={(e)=>{console.log(e)}}
                              globalUsername={"lozzoc"}/></Router>
                            );
    const targetButton = wrapper.find("#submit-continue-label-button");

    console.error("paths",targetButton.prop('history'));
    console.log(targetButton);
    // "submit-exit-label-button"
    expect(wrapper.find('Router')
    .prop('history').location.pathname)
    .toEqual("/watch")
    wrapper.unmount();
  });
  // expect("button")
  // .toEqual("disabled")


})

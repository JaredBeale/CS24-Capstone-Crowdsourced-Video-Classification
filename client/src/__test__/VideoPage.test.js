import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { MemoryRouter as Router, withRouter } from 'react-router-dom' // 4.0.0
import VideoPage from "../components/VideoPage.js"


describe('Video paged not logged int.', () => {
  it('should redirect to login page', () => {
    const wrapper = mount(<Router initialEntries={[ '/watch' ]}><VideoPage
                              setBannerExit={()=>{}}
                              handleShow={false}
                              isShown={false}
                              setGlobalUsername={false}
                              globalUsername={false}/></Router>);

    expect(wrapper.find('Router').prop('history').location.pathname)
    .toEqual("/login")



    wrapper.unmount();
  });
});

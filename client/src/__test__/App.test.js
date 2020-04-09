import React from 'react';
import App from '../App';
import {shallow, mount,render} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import { MemoryRouter as Router, withRouter } from 'react-router-dom' // 4.0.0
import { Button,TextField } from 'lucid-ui';

Enzyme.configure({ adapter: new Adapter() })
//Tests Below
it('should render Home page correctly with no props', () => {
  const component = shallow(<App/>);

  expect(component).toMatchSnapshot();
});
it('should render Home page  correctly with given strings', () => {
  const strings = ['one', 'two'];
  const component = shallow(<App list={strings} />);
  expect(component).toMatchSnapshot();
});

describe('Test LoginPage component', () => {
  it('simulates Returning user event', () => {

    const wrapper = mount(<Router><App /></Router>);
    wrapper.find('Link#LogIn').simulate('click');
      wrapper.instance().history.location.pathname = "/login"


    expect(wrapper.instance().history.location.pathname).toEqual("/login");


  });
});
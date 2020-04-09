import React from 'react';
import LoginPage from '../components/LoginPage';
import {shallow, mount,render} from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import { MemoryRouter as Router, withRouter } from 'react-router-dom' // 4.0.0
import { Button,TextField } from 'lucid-ui';

Enzyme.configure({ adapter: new Adapter() })
//Tests Below
it('should render correctly with no props', () => {
  const component = shallow(<LoginPage/>);

  expect(component).toMatchSnapshot();
});
it('should render Login page  correctly with given strings', () => {
  const strings = ['one', 'two'];
  const component = shallow(<LoginPage list={strings} />);
  expect(component).toMatchSnapshot();
});
describe('Test Button component', () => {
  it('simulates click events', () => {
    const mockCallBack = sinon.spy();
    const button = shallow((<Button onClick={mockCallBack}>Ok!</Button>));

    button.find('button').simulate('click');
    expect(mockCallBack).toHaveProperty('callCount', 1);
  });
});
describe('Test LoginPage component', () => {
  it('simulates Login event', () => {

    const wrapper = mount(<Router><LoginPage /></Router>);

    wrapper.find('button#loginButton').simulate('click');
    var username ="Test"
    wrapper.setState({username:username});
    expect(wrapper.state().username).toEqual("Test");


  });
});
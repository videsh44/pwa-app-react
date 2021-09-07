import React, { Component } from 'react';
import Login_splash from './Component/Login_splash';
import Signup from './Component/User/Signup';
import Msignup from './Component/Member/Msignup'
import Mlogin from './Component/Member/Mlogin'
import Mforgot_password from './Component/Member/Mforgot_password'
import Mreset_password from './Component/Member/Mreset_password'
import Msignup_location from './Component/Member/Msignup_location'
import Msignup_billing from './Component/Member/Msignup_billing'
import Login_home from './Component/Login_home';
import User_login from './Component/User/User_login'
import Home_page from './Component/Home_page'
import Forgot_password from './Component/User/Forgot_password'
import Reset_password from './Component/User/Reset_password'
import Multistep from './Component/Member/Multistep_signup'
import User_profile from './Component/User/User_profile'
import Mprofile from './Component/Member/Mprofile'
import Signup_home from './Component/Signup_home'
import { Switch, Route } from 'react-router-dom';
import Sessionlg from './Component/User/Sessionlg'
import { ToastContainer } from 'react-toastify';
import PrivateRoutes from './Helper/PrivateRoutes'
import MprivateRoutes from './Helper/MprivateRoutes'
import Payment from './Component/Member/Payment'
import Contact_us from './Component/Contact-us'
import Event from './Component/Event'
import Search_doctor from './Component/User/Search_doctor'
import Mixroute from './Helper/Mixroute'
import Privacy from './Component/Privacy'
import PLan from './Component/PLan'
import User_location from './Component/User/User_location'
import MentalhealthEventList from './Component/MentalhealthEventList'
import Notification from './Component/Notification'
import Mentalhealthtips from './Component/Mentalhealthtips'
// import IdleTimer from 'react-idle-timer';
import IdleTimer from "./Helper/Sessionlogout";
// import AutoLogoutTimer from './Helper/Sessionlogout'
import { Sessionout } from "./Helper/Sessionout";
import $ from 'jquery'

let deferredPrompt;
export default class App extends Component {
  constructor(props) {
    super(props)

  }

  componentDidMount() {
    Sessionout()
  }

  render() {
    return (
      <div>
        <ToastContainer />
        <Switch>
          <Route exact path="/" component={Login_splash} />
          <Route path="/signup" component={Signup} />
          <Route path="/loginhome" component={Login_home} />
          <Route path="/user" component={User_login} />
          <Route path="/forgot" component={Forgot_password} />
          <Route path="/member_login" component={Mlogin} />
          <Route  path="/privacy_policy" component={Privacy} />
          {/* <Route path="/mforgot_password" component={Mforgot_password} />
          <Route path="/mreset_password" component={Mreset_password} /> */}
          <Route path="/member_signup" component={Multistep} />
          {/* <Route path="/member_signup" component={Msignup} />
          <Route path="/msignup_location" component={Msignup_location} />
          <Route path="/msignup_billing" component={Msignup_billing} /> */}
          <Route path="/signup_home" component={Signup_home} />
          <PrivateRoutes exact path="/user_profile" component={props => <User_profile {...props} />} />
          <MprivateRoutes exact path="/m_profile" component={props => <Mprofile {...props} />} />
          {/* <Route exact path="/m_profile" component={Mprofile} /> */}
          {/* <Route exact path="/profile" component={Profile} /> */}
          <PrivateRoutes exact path="/home_page/:name?" component={props => <Home_page {...props} />} />
          <Mixroute path="/contact" component={props => <Contact_us {...props} />} />
          <Mixroute path="/event" component={props => <Event {...props} />} />
          <Mixroute path="/notification" component={props => <Notification {...props} />} />
          <Route path="/plan" component={PLan} />
          <Route path="/removesession" component={Sessionlg} />
          <Route path="/user_location" component={User_location} />
          <Mixroute exact path="/getmentalhealth" component={props => <MentalhealthEventList {...props} />} />
          <Mixroute exact path="/mental_health_tips" component={props => <Mentalhealthtips {...props} />} />
        </Switch>
      </div>
    )
  }
}

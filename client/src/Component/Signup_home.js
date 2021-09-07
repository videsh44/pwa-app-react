import React, { Component } from 'react'
import logo from '../assets/images/logo.png'
import { NavLink } from 'react-router-dom'
export default class Signup_home extends Component {
    constructor(props) {
        super(props)

    }
    sign_up_as_user = () => {
        localStorage.clear()
        this.props.history.push('/signup')
    }
    sign_up_as_member = () => {
        localStorage.clear()
        this.props.history.push('/member_signup')
    }

    render() {
        return (
            <div>
                <section className="main-container">
                    <div className="container-fluid center-block">
                        <div className="content login-con">
                            <div className="logo"><a href="#"><img src={logo} /></a></div>
                            <div className="login-heading">Sign up as</div>
                            <button type="button" className="btn btn-outline-primary" onClick={this.sign_up_as_member}>Professional Membership Registration</button>
                            <div className="or">Or</div>
                            <button type="button" className="btn btn-primary" onClick={this.sign_up_as_user}>Member Directory</button>
                            <div className="dont-have-account">Already have an account? <NavLink to="/loginhome">Log In</NavLink></div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

import React, { Component } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import axios from '../Helper/Instance';
import Apis from '../Helper/Apis'

export default class login_home extends Component {
    constructor(props) {
        super(props)
        let findtoken = localStorage.getItem("role")
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
            this.web_role = params.get("roletype")
        }
        this.state = {
            findtoken,
        }
    }

    sign_in_as_user = () => {
        let userValue = localStorage.setItem("account", "User")
        this.props.history.push({
            pathname: '/user',
            state: { account: userValue }
        });
    }

    sign_in_as_member = () => {
        let memberValue = localStorage.setItem("account", "Member")
        this.props.history.push({
            pathname: '/user',
            state: { account: memberValue }
        });
    }

    async componentDidMount() {
        var config = {};
        let token = localStorage.getItem("token")
        if (token !== null) {
            var config = {
                "Authorization": `Bearer ${token}`
            }
        } else if (this.web_token !== undefined) {
            var config = {
                "Authorization": `Bearer ${this.web_token}`
            }
        }

        if (token != null) {
            let tokenfind = await axios.get('/ca/v1/getProfile',
                {
                    headers: config
                })

            if (this.state.findtoken === "User" && token) {
                this.props.history.push(`/home_page/${tokenfind.data.data.user_data.data.display_name}`)
            }
        }
    }

    render() {
        let token = localStorage.getItem("token")
        if (this.state.findtoken != null || this.web_role !== "") {
            if (this.state.findtoken === "subscriber" && token || this.web_role === "subscriber" && this.web_token) {
                return <Redirect to="/m_profile" />
            }
        }
        return (
            <div>
                <section className="main-container">
                    <div className="container-fluid center-block">
                        <div className="content login-con">
                            <div className="logo"><img src={logo} alt="login" /></div>
                            <div className="login-heading">Login as</div>
                            <button type="button" className="btn btn-outline-primary" onClick={this.sign_in_as_member}>Professional Membership Registration</button>
                            <div className="or">Or</div>
                            <button type="button" className="btn btn-primary" onClick={this.sign_in_as_user}>Member Directory</button>
                            <div className="dont-have-account">Don't have an account? <NavLink to="/signup_home" >Sign Up</NavLink></div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

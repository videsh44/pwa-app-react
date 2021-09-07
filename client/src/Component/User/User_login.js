import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import '../script'
import { NavLink, Redirect } from 'react-router-dom'
import { isEmail, validateEmail, isPassword, validatepassowrd, isEmpty } from '../../Validation/signup'
import { toast } from 'react-toastify'
import axios from '../../Helper/Instance';
import $ from 'jquery'
import inputPlaceHolders from '../../Helper/Form_control'
import api from '../../Helper/Apis'
import Apis from '../../Helper/Apis'
// import { Offline, Online } from "react-detect-offline";
var settoken = null
var userId = null
export default class User_login extends Component {
    constructor(props) {
        super(props)
        let findtoken = localStorage.getItem("role")
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
            this.web_role = params.get("roletype")
        }
        this.state = {
            roles: "",
            Email: "",
            Password: "",
            findtoken,
            FirstName: "",
            LastName: "",
            changeoption: false,
            changemember: false,
            content: [],
            membercontent: [],
            settomember: false,
            changetoUser: false,
            errors: {}
        }
    }

    getVal = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validateRegisterParam = () => {
        let errors = {};
        if (isEmail(this.state)) errors.Email = 'Please enter email.';
        else if (!validateEmail(this.state)) errors.Email = 'Please enter valid email.';
        if (isPassword(this.state)) errors.Password = 'Please enter Password.';
        else if (!(validatepassowrd(this.state))) errors.Password = 'Please enter valid Password.it must contain 8 or more characters that are of at least one number, and one uppercase and lowercase letter and special character';
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    loginform = async (e) => {
        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }

        const headers = {
            "Content-Type": "application/json",
        }

        try {
            let loginapi = await axios.post(Apis.Userlogin, {
                username: this.state.Email,
                password: this.state.Password
            }, {
                headers: headers
            })
            if (loginapi.data.token) {
                if ('caches' in window) {
                    caches.keys().then((names) => {
                        names.forEach(name => {
                            caches.delete(name);
                        })
                    });
                    // window.location.reload(true);
                }
                localStorage.clear()
                settoken = loginapi.data.token
                var config = {};
                if (settoken !== null) {
                    var config = {
                        "Authorization": `Bearer ${settoken}`
                    }
                } else if (this.web_token !== undefined) {
                    var config = {
                        "Authorization": `Bearer ${this.web_token}`
                    }
                }
                let getprofileApi = await axios.get(Apis.getProfile,
                    {
                        headers: config
                    })
                userId = getprofileApi.data.data.user_data.ID
                localStorage.setItem("role", getprofileApi.data.data.user_data.roles[0])
                if (getprofileApi.data.data.user_data.roles[0] === "subscriber") {
                    // if (getprofileApi.data.data.user_other_info.hasOwnProperty('subscriptionAccountStatus')) {
                    //     if (getprofileApi.data.data.user_other_info.subscriptionAccountStatus[0] === "active") {
                    //         localStorage.setItem("token", settoken)
                    //         toast.success("Login Successfully")
                    //         this.props.history.push("/m_profile")
                    //     } else if (getprofileApi.data.data.user_other_info.subscriptionAccountStatus[0] === "deactivate") {
                    //         toast.success("Account Deactivate ! Please Create Subscription")
                    //         let docval = await axios.get('/ca/v1/users', {
                    //             params: {
                    //                 user_id: userId
                    //             }
                    //         })
                    //         this.setState({
                    //             changemember: true,
                    //             membercontent: docval.data.data
                    //         })
                    //     }
                    // } else if (!getprofileApi.data.data.user_other_info.hasOwnProperty('subscriptionAccountStatus')) {
                    //     console.log(userId)
                    //     let docval = await axios.get('/ca/v1/users', {
                    //         params: {
                    //             user_id: userId
                    //         }
                    //     })
                    //     this.setState({
                    //         settomember: true,
                    //         membercontent: docval.data.data
                    //     })
                    // }

                    //  --------------------------------------------
                    // temparory code
                    localStorage.setItem("token", settoken)
                    toast.success("Login Successfully")
                    this.props.history.push("/m_profile")

                } else if (getprofileApi.data.data.user_data.roles[0] === "User") {
                    // if (getprofileApi.data.data.user_other_info.hasOwnProperty('subscriptionAccountStatus')) {
                    //     if (getprofileApi.data.data.user_other_info.subscriptionAccountStatus[0] === "active") {
                    // localStorage.setItem("token", settoken)
                    // toast.success("Login Successfully")
                    // this.props.history.push(`/home_page/${getprofileApi.data.data.user_data.data.display_name}`)
                    //     } else if (getprofileApi.data.data.user_other_info.subscriptionAccountStatus[0] === "deactivate") {
                    //         toast.success("Account Deactivate ! Please Create Subscription")
                    //         this.setState({
                    //             changetoUser: true,
                    //             content: getprofileApi.data.data
                    //         })
                    //     }
                    // } else if (!getprofileApi.data.data.user_other_info.hasOwnProperty('subscriptionAccountStatus')) {
                    //     this.setState({
                    //         changeoption: true,
                    //         content: getprofileApi.data.data
                    //     })
                    // }

                    //  --------------------------------------------
                    // temparory code
                    localStorage.setItem("token", settoken)
                    toast.success("Login Successfully")
                    this.props.history.push(`/home_page/${getprofileApi.data.data.user_data.data.display_name}`)
                }
            } else {
                console.log("when token not generate")
            }
        } catch (error) {
            if (!error.response) {
                console.log("not internet connection")
            } else {
                if (error.response.data.message === "Unknown email address. Check again or try your username.") {
                    toast.error("Invalid Email Address")
                } else {
                    toast.error("Password should be correct")
                }
            }
        }
    }

    Usersignup = () => {
        let GetAccount = localStorage.getItem("account")
        if (GetAccount === "Member") {
            localStorage.removeItem("User_id")
            this.props.history.push("/member_signup")
        } else if (GetAccount === "User") {
            localStorage.removeItem("User_id")
            this.props.history.push("/signup")
        }
    }

    async componentDidMount() {
        inputPlaceHolders()
        let gettoken = localStorage.getItem("token")
        var config = {};
        if (gettoken !== null) {
            var config = {
                "Authorization": `Bearer ${gettoken}`
            }
        } else if (this.web_token !== undefined) {
            var config = {
                "Authorization": `Bearer ${this.web_token}`
            }
        }
        if (gettoken !== null) {
            let tokenfind = await axios.get('/ca/v1/getProfile',
                {
                    headers: config
                })

            if (this.state.findtoken === "User" && gettoken) {
                this.props.history.push(`/home_page/${tokenfind.data.data.user_data.data.display_name}`)
            }
        }
    }

    prevRoute = () => {
        this.props.history.push("/loginhome")
    }

    render() {
        let gettoken = localStorage.getItem("token")
        if (this.state.findtoken != null && gettoken || this.web_token !== undefined && this.web_role) {
            if (this.state.findtoken === "subscriber" || this.web_role === "subscriber") {
                return <Redirect to="/m_profile" />
            }
        }

        if (this.state.changeoption) {
            return <Redirect to={{
                pathname: '/user_location',
                state: {
                    pass: this.state.Password,
                    personal: this.state.content
                }
            }} />
        }

        if (this.state.changemember) {
            return <Redirect to={{
                pathname: '/plan',
                state: {
                    userId: userId,
                    pass: this.state.Password,
                    personal: this.state.membercontent
                }
            }} />
        }

        if (this.state.settomember) {
            return <Redirect to={{
                pathname: '/member_signup',
                state: {
                    pass: this.state.Password,
                    userId: userId,
                    personal: this.state.membercontent
                }
            }} />
        }

        if (this.state.changetoUser) {
            return <Redirect to={{
                pathname: '/plan',
                state: {
                    pass: this.state.Password,
                    personal: this.state.content
                }
            }} />
        }
        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="links">
                            <a href="#!" onClick={this.prevRoute}><i className="angle-left"></i>Back</a>
                        </div>
                    </div>
                </div>
                <section className="main-container mid-con">
                    <div className="container-fluid">
                        <div className="content login">
                            <div className="logo"><img src={logo} /></div>
                            <div className="welcome">
                                <strong>Welcome Back</strong>
                                Enter your credentials to continue!
                            </div>
                            <form onSubmit={this.loginform}>
                                <div className="form-block formBox">
                                    <fieldset>
                                        <span className="placeholder">Email</span>
                                        <input type="text" name="Email" onChange={this.getVal} value={this.state.email} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Password</span>
                                        <input type="password" name="Password" className="form-control input__field" onChange={this.getVal} value={this.state.password} autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Password}</label>
                                    </fieldset>
                                    <div className="forgot-link"><NavLink to="/forgot">Forgot Password?</NavLink></div>
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>
                            <div className="dont-have-account">Don't have an account? <button onClick={this.Usersignup}>Sign Up</button></div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

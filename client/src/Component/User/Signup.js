import React, { Component } from 'react';
import logo from '../../assets/images/logo.png'
import { NavLink } from 'react-router-dom';
import { validname } from '../../Validation/signup';
import { isfirstname, ValidFirstname, isLastname, ValidLastname, isEmail, validateEmail, isPassword, validatepassowrd, validateaccount } from '../../Validation/signup'
import { toast } from 'react-toastify';
import inputPlaceHolders from '../../Helper/Form_control'
import axios from '../../Helper/Instance';
import { userprofiledata } from '../../Helper/ProfileApi'
import { Redirect } from 'react-router-dom'
export default class Signup extends Component {
    constructor(props) {
        super(props)
        let findtoken = localStorage.getItem("role")
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
            this.web_role = params.get("roletype")
        }
        this.state = {
            Account: "User",
            FirstName: "",
            LastName: "",
            Email: "",
            Password: "",
            findtoken,
            errors: {}
        }
    }

    getValue = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validateRegisterParam = () => {
        let errors = {};
        // if (validateaccount(this.state)) errors.Account = 'Please enter your account type'
        if (isfirstname(this.state)) errors.Firstname = 'Please enter your Firstname'
        else if (!ValidFirstname(this.state)) errors.Firstname = 'Name should be Char.';
        if (isLastname(this.state)) errors.Lastname = 'Please enter your Lastname';
        else if (!ValidLastname(this.state)) errors.Lastname = 'Name should be Char.';
        if (isEmail(this.state)) errors.Email = 'Please enter email.';
        else if (!validateEmail(this.state)) errors.Email = 'Please enter valid email.';
        if (isPassword(this.state)) errors.Password = 'Please enter Password.';
        else if (!(validatepassowrd(this.state))) errors.Password = 'Please enter valid Password.it must contain 8 or more characters that are of at least one number, and one uppercase and lowercase letter and special character';
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    register = async (e) => {
        e.preventDefault();
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        //api call here
        let userData = {
            account: this.state.Account,
            first_name: this.state.FirstName,
            last_name: this.state.LastName,
            email: this.state.Email,
            password: this.state.Password,
        };
        console.log(this.props)
        let getId = localStorage.getItem("User_id")
        try {
            if (typeof getId !== 'undefined' && getId) {
                let userData1 = {
                    user_id: getId,
                    account: this.state.Account,
                    first_name: this.state.FirstName,
                    last_name: this.state.LastName,
                    email: this.state.Email,
                    password: this.state.Password,
                };
                let createuserprofile1 = await axios.post('/api/wp-json/ca/v1/addUsers', userData1, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                console.log(createuserprofile1.data)
                if (createuserprofile1.data.error === 0) {
                    localStorage.setItem("password", this.state.Password)
                    localStorage.setItem("role", "User")
                    localStorage.setItem("User_id", createuserprofile1.data.data.user_data.ID)
                    this.props.history.push({
                        pathname: '/user_location',
                        state: { credential: this.state }
                    });
                } else if (createuserprofile1.data.error === 1) {
                    if (createuserprofile1.data.msg[0] === "Sorry, that username already exists!") {
                        toast.error("Sorry, that email address is already used!")
                    } else {
                        toast.error(createuserprofile1.data.msg[0])
                    }
                }
            } else {
                let createuserprofile = await axios.post('/api/wp-json/ca/v1/addUsers', userData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if (createuserprofile.data.error === 0) {
                    localStorage.setItem("role", "User")
                    localStorage.setItem("User_id", createuserprofile.data.data.user_data.ID)
                    localStorage.setItem("password", this.state.Password)
                    this.props.history.push({
                        pathname: '/user_location',
                        state: { credential: this.state }
                    });
                } else if (createuserprofile.data.error === 1) {
                    if (createuserprofile.data.msg[0] === "Sorry, that username already exists!") {
                        toast.error("Sorry, that email address is already used!")
                    } else {
                        toast.error(createuserprofile.data.msg[0])
                    }
                }
            }
        } catch (error) {
            if (!error.response) {
                console.log("not internet connection")
            } else {
                toast.error(error.response.data.message)

            }
        }
    }

    Usersignin = () => {
        this.props.history.push({
            pathname: '/user',
            state: { account: "User" }
        });

    }

    async componentDidMount() {
        console.log(this.props)
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        let getId = localStorage.getItem("User_id")
        let token = localStorage.getItem('token')
        let password = localStorage.getItem("password")
        var config = {};
        if (token !== null) {
            var config = {
                "Authorization": `Bearer ${token}`
            }
        } else if (this.web_token !== undefined) {
            var config = {
                "Authorization": `Bearer ${this.web_token}`
            }
        }
        if (typeof getId !== 'undefined' && getId && token === null && this.state.findtoken === "User") {
            let pass = password
            let docval = await axios.get('/ca/v1/users', {
                params: {
                    user_id: getId
                }
            })
            console.log(docval.data.data)
            this.setState({
                FirstName: docval.data.data.user_other_info.first_name[0],
                LastName: docval.data.data.user_other_info.last_name[0],
                Email: docval.data.data.user_data.data.user_email,
                Password: pass
            })
        } else if (token && this.state.findtoken === "User") {
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
    }

    prevRoutes = () => {
        this.props.history.push("/loginhome")
    }

    render() {
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        let token = localStorage.getItem("token")
        if (this.state.findtoken === "subscriber" && token || this.web_role === "subscriber" && this.web_token) {
            return <Redirect to={"/m_profile"} />
        }
        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="links">
                            <a href="#!" onClick={this.prevRoutes}><i className="angle-left"></i>Back</a>
                        </div>
                    </div>
                </div>
                <section className="main-container mid-con">
                    <div className="container-fluid">
                        <div className="content login">
                            <div className="logo"><a href="#"><img src={logo} /></a></div>
                            <div className="welcome">
                                <strong>Create Your Account</strong>
                                Join Now- it's free & easy!
                            </div>
                            <form onSubmit={this.register}>
                                <div className="form-block formBox">
                                    <fieldset className="selectInput">
                                        <input type="hidden" name="Account" defaultValue="User" />
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">First Name </span>
                                        <input type="text" name="FirstName" className="form-control input__field" value={this.state.FirstName} onChange={this.getValue} autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Firstname}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Last Name </span>
                                        <input type="text" name="LastName" value={this.state.LastName} onChange={this.getValue} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Lastname}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Email</span>
                                        <input type="text" name="Email" value={this.state.Email} onChange={this.getValue} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                    </fieldset>
                                    <div className="fieldRow">
                                        <fieldset>
                                            <span className="placeholder">Password</span>
                                            <input type="password" name="Password" value={this.state.Password} onChange={this.getValue} className="form-control input__field" autoComplete="off" />
                                        </fieldset>
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Password}</label>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                            <div className="dont-have-account">Already have an account?<button onClick={this.Usersignin}>log In</button></div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

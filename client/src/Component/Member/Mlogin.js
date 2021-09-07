import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { NavLink } from 'react-router-dom'
import { isEmail, validateEmail, isPassword, validatepassowrd } from '../../Validation/signup'
import axios from 'axios'
import { toast } from 'react-toastify'
import inputPlaceHolders from '../../Helper/Form_control'
export default class  Mlogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Email: "",
            Password: "",
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
        else if (isPassword(this.state)) errors.Password = 'Please enter Password.';
        else if (!(validatepassowrd(this.state))) errors.Password = 'Please enter right numbers.';
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    memberformsubmit = (e) => {
        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        const headers = {
            "Content-Type": "application/json",
        }

        axios.post("https://mpn.cladev.com/wp-json/jwt-auth/v1/token", {
            username: this.state.Email,
            password: this.state.Password
        }, {
            headers: headers
        })
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem('member_signin_token', res.data.token)
                    this.props.history.push("/profile")
                }
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data.message)
                }
            })
    }

    render() {
        inputPlaceHolders()
        return (
            <div>
                <section className="main-container">
                    <div className="container-fluid">
                        <div className="content login">
                            <div className="logo"><img src={logo} /></div>
                            <div className="welcome">
                                <strong>Welcome Back</strong>
                        Enter your credentials to continue!
                    </div>
                            <form onSubmit={this.memberformsubmit}>
                                <div className="form-block formBox">
                                    <fieldset>
                                        <span className="placeholder">Email</span>
                                        <input type="text" name="Email" onChange={this.getVal} value={this.state.Email} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Password</span>
                                        <input type="password" onChange={this.getVal} name="Password" value={this.state.Password} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Password}</label>
                                    </fieldset>
                                    <div className="forgot-link"><NavLink to="/forgot">Forgot Password?</NavLink></div>
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>
                            <div className="dont-have-account">Don't have an account? <NavLink to="/member_signup">Sign Up</NavLink></div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

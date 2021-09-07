import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { isEmail, validateEmail } from '../../Validation/signup'
import inputPlaceHolders from '../../Helper/Form_control'
import axios from '../../Helper/Instance'
import { toast } from 'react-toastify'
import Reset_password from '../User/Reset_password'
import { NavLink } from 'react-router-dom'
import MPNlogo from '../MPNlogo'
export default class Forgot_password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Email: "",
            errors: {},
            route: false
        }
    }

    validateRegisterParam = () => {
        let errors = {};
        if (isEmail(this.state)) errors.Email = 'Please enter email.';
        else if (!validateEmail(this.state)) errors.Email = 'Please enter valid email.';
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    resetPassword = (e) => {
        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        axios.post('/bdpwr/v1/reset-password', {
            email: this.state.Email
        }).then((res) => {
            toast.success(res.data.message)
            this.setState({
                route: true
            })
        }).catch((error) => {
            if (error.response) {
                toast.error(error.response.data.message)
            }
        })
    }


    getVal = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    componentDidMount() {
        inputPlaceHolders()
      
    }

    render() {
        if (this.state.route) {
            return <Reset_password Email={this.state.Email} />
        }
        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="links">
                            <NavLink to="/loginhome"><i className="angle-left"></i>Back</NavLink>
                        </div>
                    </div>
                </div>
                <section className="main-container mid-con">
                    <div className="container-fluid">
                        <div className="content login">
                            <div className="logo"><img src={logo} /></div>
                            <div className="welcome">
                                <strong>Forgot Password?</strong>
                                 Enter your email id to get OTP!
                            </div>
                            <form onSubmit={this.resetPassword}>
                                <div className="form-block formBox">
                                    <fieldset>
                                        <span className="placeholder">Enter Email</span>
                                        <input type="text" onChange={this.getVal} name="Email" value={this.state.Email} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                    </fieldset>
                                </div>
                                <button type="submit" className="btn btn-primary">Reset Password</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

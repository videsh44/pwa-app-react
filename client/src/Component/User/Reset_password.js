import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { isPassword, validatepassowrd, matchPassword, isOtp } from '../../Validation/signup'
import inputPlaceHolders from '../../Helper/Form_control'
import { checkNumberFieldLength } from '../../Helper/Edu_validation'
import axios from '../../Helper/Instance'
import { toast } from 'react-toastify'
import { NavLink, withRouter } from 'react-router-dom'
import Forgot_password from '../User/Forgot_password'
class Reset_password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Password: "",
            Confirm_Password: "",
            Otp: "",
            errors: {},
            route: false
        }
    }

    getVal = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validateRegisterParam = () => {
        let errors = {};
        if (isPassword(this.state)) errors.Password = 'Please enter Your Password.';
        else if (!(validatepassowrd(this.state))) errors.Password = 'Please enter valid Password.it must contain 8 or more characters that are of at least one number, and one uppercase and lowercase letter and special character';
        if (!(matchPassword(this.state))) errors.Match = 'Password should be match';
        if (isOtp(this.state)) errors.Otp = 'Please enter Your Otp'
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    resetform = (e) => {
        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        axios.post('/bdpwr/v1/set-password', {
            email: this.props.Email,
            password: this.state.Password,
            code: this.state.Otp
        }).then((res) => {
            toast.success(res.data.message)
            this.props.history.push("/loginhome")
        }).catch((error) => {
            if (error.response) {
                if (error.response.data.message === "You must request a password reset code before you try to set a new password.") {
                    this.props.history.push("/forgot")
                } else {
                    toast.error(error.response.data.message)
                }
            }
        })
    }

    componentDidMount() {
        inputPlaceHolders()

    }

    prevRoute = () => {
        this.setState({
            route: true
        })
    }

    render() {
        if (this.state.route) {
            return <Forgot_password />
        }
        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="links">
                            <a href="javascript:void(0)" onClick={this.prevRoute}><i className="angle-left"></i>Back</a>
                        </div>
                    </div>
                </div>
                <section className="main-container">
                    <div className="container-fluid">
                        <div className="content login">
                            <div className="logo"><a href="#"><img src={logo} /></a></div>
                            <div className="welcome">
                                <strong>Reset Password</strong>
                                Enter your new password
                            </div>
                            <form onSubmit={this.resetform}>
                                <div className="form-block formBox">
                                    <fieldset>
                                        <span className="placeholder">New Password</span>
                                        <input type="password" onChange={this.getVal} name="Password" className="form-control input__field" value={this.state.Password} autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Password}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Confirm Password</span>
                                        <input type="password" onChange={this.getVal} name="Confirm_Password" className="form-control input__field" value={this.state.Confirm_Password} autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Match}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">OTP</span>
                                        <input type="number" onInput={(num) => { checkNumberFieldLength(num) }} name="Otp" onChange={this.getVal} value={this.state.Otp} className="form-control input__field" autoComplete="off"></input>
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Otp}</label>
                                    </fieldset>
                                </div>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
export default withRouter(Reset_password)
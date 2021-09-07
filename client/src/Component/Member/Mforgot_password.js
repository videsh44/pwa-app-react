import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { isEmail, validateEmail } from '../../Validation/signup'
import inputPlaceHolders from '../../Helper/Form_control'
export default class Mforgot_password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Email: "",
            errors: {}
        }
    }

    getVal = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    forgotsubmit = (e) => {
        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        // this.props.history.push('/mreset_password')
    }

    validateRegisterParam = () => {
        let errors = {};
        if (isEmail(this.state)) errors.Email = 'Please enter email.';
        else if (!validateEmail(this.state)) errors.Email = 'Please enter valid email.';
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
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
                                <strong>Forgot Password?</strong>
                        Enter your email id to get OTP!
                    </div>
                            <form onSubmit={this.forgotsubmit}>
                                <div className="form-block formBox">
                                    <fieldset>
                                        <span className="placeholder">Enter Email</span>
                                        <input type="text" name="Email" onChange={this.getVal} value={this.state.Email} className="form-control input__field" autoComplete="off" />
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

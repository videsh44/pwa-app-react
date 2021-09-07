import React, { Component } from 'react'
import { isPassword, validatepassowrd, matchPassword } from '../../Validation/signup'
import logo from '../../assets/images/logo.png'
import inputPlaceHolders from '../../Helper/Form_control'
export default class  Mreset_password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Password: "",
            Confirm_Password: "",
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
        if (isPassword(this.state)) errors.Password = 'Please enter Your Password.';
        else if (!(validatepassowrd(this.state))) errors.Password = 'Please enter valid Password.it must contain 8 or more characters that are of at least one number, and one uppercase and lowercase letter and special character';
        else if (!(matchPassword(this.state))) errors.Match = 'Password should be match'
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    resetsubmit = (e) => {

        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }

        //api calling 
        this.setState({
            Password: "",
            Confirm_Password: ""
        })
    }

    render() {
        inputPlaceHolders()
        return (
            <div>
                <section className="main-container">
                    <div className="container-fluid center-block">
                        <div className="content login">
                            <div className="logo"><a href="#"><img src={logo} /></a></div>
                            <div className="welcome">
                                <strong>Reset Password</strong>
                        Enter your new password
                    </div>
                            <form onSubmit={this.resetsubmit}>
                                <div className="form-block formBox">
                                    <fieldset>
                                        <span className="placeholder">New Password</span>
                                        <input type="password" onChange={this.getVal} name="Password" value={this.state.Password} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Password}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Confirm Password</span>
                                        <input type="password" onChange={this.getVal} name="Confirm_Password" value={this.state.Confirm_Password} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.Match}</label>
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

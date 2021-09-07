import React, { Component } from 'react'
import { isfirstname, ValidFirstname, isLastname, ValidLastname, isEmail, validateEmail, isPassword, validatepassowrd, validatecountry, validategender } from '../../Validation/signup'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom'
import inputPlaceHolders from '../../Helper/Form_control'
import { withRouter } from 'react-router-dom'
class Msignup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Account: "Member",
            FirstName: "",
            LastName: "",
            Email: "",
            Password: "",
            Gender: "",
            errors: {}
        }
    }

    saveAndContinue = (e) => {
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        this.props.nextStep()
    }

    validateRegisterParam = () => {
        let errors = {};
        if (isfirstname(this.props.values)) errors.Firstname = 'Please enter your Firstname'
        else if (!ValidFirstname(this.props.values)) errors.Firstname = 'name should be Char.';
        if (isLastname(this.props.values)) errors.Lastname = 'Please enter your Lastname';
        else if (!ValidLastname(this.props.values)) errors.Lastname = 'name should be Char.';
        if (isEmail(this.props.values)) errors.Email = 'Please enter email.';
        else if (!validateEmail(this.props.values)) errors.Email = 'Please enter valid email.';
        if (isPassword(this.props.values)) errors.Password = 'Please enter Password.';
        else if (!(validatepassowrd(this.props.values))) errors.Password = 'Please enter valid Password.it must contain 8 or more characters that are of at least one number, and one uppercase and lowercase letter and special character';
        if (validategender(this.props.values)) errors.gender = 'Please enter your Gender'
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }


    Membersignin = () => {
        this.props.history.push({
            pathname: '/user',
            state: { account: "member" }
        });
    }

    componentDidMount() {
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
    }

    MprevRoute = () => {
        this.props.history.push("/loginhome")
    }

    render() {
        const { values } = this.props
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="links">
                            <a href="#!" onClick={this.MprevRoute}><i className="angle-left"></i>Back</a>
                            <a href="#!" onClick={this.Membersignin}>Log In</a>
                        </div>
                    </div>
                </div>
                <section className="main-container mid-con">
                    <div className="container-fluid">
                        <div className="content login">
                            <div className="welcome mg-top-0">
                                <strong>Create Your Account</strong>
                        Join Now- it's free & easy!
                    </div>
                            <div className="form-block formBox">
                                <fieldset>
                                    <input type="hidden" name="Account" defaultValue="Member" />
                                </fieldset>
                                <fieldset>
                                    <span className="placeholder">First Name </span>
                                    <input type="text" name="FirstName" onChange={this.props.handleChange} value={values.FirstName} className="form-control input__field" autoComplete="off" />
                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Firstname}</label>
                                </fieldset>
                                <fieldset>
                                    <span className="placeholder">Last Name </span>
                                    <input type="text" name="LastName" className="form-control input__field" value={values.LastName} onChange={this.props.handleChange} autoComplete="off" />
                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Lastname}</label>
                                </fieldset>
                                <fieldset>
                                    <span className="placeholder">Email</span>
                                    <input type="text" name="Email" value={values.Email} className="form-control input__field" onChange={this.props.handleChange} autoComplete="off" />
                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                </fieldset>
                                <div className="fieldRow">
                                    <fieldset>
                                        <span className="placeholder">Password</span>
                                        <input type="password" name="Password" className="form-control input__field" value={values.Password} onChange={this.props.handleChange} autoComplete="off" />
                                    </fieldset>
                                    <label className="error password-error" style={{ display: "block" }}>{this.state.errors.Password}</label>
                                </div>
                                <fieldset className="selectInput">
                                    <span className="placeholder">Gender</span>
                                    <select className="form-control input__field" value={values.Gender} onChange={this.props.handleChange} name="Gender" >
                                        <option value="">Please Select Your Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Others">Others</option>
                                    </select>
                                    <label className="error" style={{ display: "block" }}>{this.state.errors.gender}</label>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="bottom-footer">
                    <div className="container-fluid">
                        <div className="button-block">
                            <button type="button" className="btn btn-primary" onClick={this.saveAndContinue}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Msignup)

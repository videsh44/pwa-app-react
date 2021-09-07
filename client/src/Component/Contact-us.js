import React, { Component } from 'react'
import logo from '../assets/images/hemburger-icon.png'
import facebook from '../assets/images/facebook.png';
import linkin from '../assets/images/in.png';
import insta from '../assets/images/insta.png';
import twitter from '../assets/images/twitter.png';
import tiktok from '../assets/images/tiktok.png';
import { isfirstname, ValidFirstname, iscontact, validatecontact, isEmail, validateEmail, validatesubject, validatemessage, isPassword, validatepassowrd, validateaccount } from '../Validation/signup'
import inputPlaceHolders from '../Helper/Form_control'
import axios from '../Helper/Instance';
import { toast } from 'react-toastify'
import sidemenu from '../Helper/Sidemenu'
import { NavLink } from "react-router-dom";
import applogo from '../assets/images/logo.png'

import bell from '../assets/images/bell-icon.png';
import Sidebar from '../Component/Sidebar'
import { isIOSDevice } from '../Helper/Device_detect'
export default class Contact_us extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FirstName: "",
            Email: "",
            phone: "",
            Subject: "",
            Message: "",
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
        if (isfirstname(this.state)) errors.Firstname = 'Please enter you Firstname'
        else if (!ValidFirstname(this.state)) errors.Firstname = 'Name should be Char.';
        if (isEmail(this.state)) errors.Email = 'Please enter email.';
        else if (!validateEmail(this.state)) errors.Email = 'Please enter valid email.';
        if (iscontact(this.state)) errors.phone = "Please enter phone number"
        else if (!validatecontact(this.state)) errors.phone = "Please enter correct phone number"
        if (validatesubject(this.state)) errors.subject = "Please fill your Subject"
        if (validatemessage(this.state)) errors.message = "Please fill your Message"
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    ContactSubmit = (e) => {
        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        let form_data = new FormData();
        form_data.append("your-name", this.state.FirstName);
        form_data.append("your-email", this.state.Email);
        form_data.append("your-subject", this.state.Subject);
        form_data.append("your-message", this.state.Message);
        axios.post('/contact-form-7/v1/contact-forms/48/feedback', form_data).then((res) => {
            toast.success("Thank you for connecting with us.")
            this.setState({
                FirstName: "",
                Email: "",
                phone: "",
                Subject: "",
                Message: "",
                errors: {}
            })
        }).catch((e) => {
            console.log(e)
        })

    }
    componentDidMount() {
        inputPlaceHolders()
        sidemenu()
    }

    render() {
        const { FirstName, Email, phone, Subject, Message } = this.state
        return (
            <div>
                <Sidebar />
                <div className="header">
                    <div className="container-fluid">
                        <div className="inner-con search-doctor">
                            <div className="hemburger-menu">
                                {
                                    !isIOSDevice() && <a href="#" id="menuBtn"><img src={logo} alt="Hemburger" /></a>
                                }
                                <span>Contact Us</span>
                            </div>
                            <a href="#" className="applogo"><img src={applogo} height="40px" alt="" /></a>

                        </div>
                    </div>
                </div>
                <section className="main-section">
                    <div className="content-section ">
                        <div className="container-fluid">
                            <div className="contact-us">

                                <div className="heading">
                                    <strong>Get in touch</strong>
                                    We are here for you! How can we help?
                                </div>
                                <div className="socialLinks">
                                    <a href="https://www.facebook.com/Minoritypsychologynetwork/"><img src={facebook} alt="Facebook" /></a>
                                    <a href="https://www.linkedin.com/company/minority-psychology-network"><img src={linkin} alt="Linked In" /></a>
                                    <a href="https://www.instagram.com/minority_psychology_network/"><img src={insta} alt="Instagram" /></a>
                                    <a href="https://twitter.com/mpn_mpn_"><img src={twitter} alt="Twitter" /></a>
                                    <a href="#"><img src={tiktok} alt="Tiktop" /></a>
                                </div>
                                <form onSubmit={this.ContactSubmit}>
                                    <div className="form-block formBox">
                                        <fieldset>
                                            <span className="placeholder">Name </span>
                                            <input type="text" name="FirstName" onChange={this.getValue} value={FirstName} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.Firstname}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">Email </span>
                                            <input type="text" name="Email" value={Email} onChange={this.getValue} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">Mobile Number</span>
                                            <input type="text" name="phone" value={phone} onChange={this.getValue} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.phone}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">Subject</span>
                                            <input type="text" name="Subject" value={Subject} onChange={this.getValue} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.subject}</label>
                                        </fieldset>
                                        <fieldset className="textareaInput">
                                            <span className="placeholder">Message</span>
                                            <textarea name="Message" value={Message} onChange={this.getValue} className="form-control input__field"></textarea>
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.message}</label>
                                        </fieldset>
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

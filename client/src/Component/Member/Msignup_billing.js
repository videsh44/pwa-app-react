import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import inputPlaceHolders from '../../Helper/Form_control'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import axiosInstance from '../../Helper/Instance'
import PLan from '../PLan'
import Apis from '../../Helper/Apis'
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify'
import "react-datepicker/dist/react-datepicker.css";
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { isMentalhealth, isLicensestate, isLicensenumber, isLicensexpiration, validatecountry1, isAddress1, isStreetaddress1, isStreetline21, isCity1, isState1, isZipcode1, Zipcodevalidate1 } from '../../Validation/signup'
import moment from 'moment'
import { isIOSDevice } from '../../Helper/Device_detect'

class Msignup_billing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Mental_health_role: "",
            License_number: "",
            License_state: "",
            License_expiration: "",
            Card_number: "",
            Expiry_date: "",
            Security_code: "",
            Name_on_card: "",
            Billing_address: "",
            healthrolelist: [],
            Licensestatelist: [],
            custom_address: "",
            errors: {},
        }
    }

    saveAndContinue = async (e) => {
        e.preventDefault();
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        let user_id = localStorage.getItem('User_id')
        const { values } = this.props
        console.log(values.Billing_address)
        axiosInstance.post('/ca/v1/updateUserBillingInfo', {
            user_id: user_id,
            Mental_health_role: values.Mental_health_role,
            License_number: values.License_number,
            License_state: values.License_state,
            License_expiration: values.startDate,
            billing_address: values.address1,
            billing_street_address: values.street_address1,
            billing_address_line2: values.address_line_21,
            billing_country: values.Country1,
            billing_state: values.State1,
            billing_city: values.city1,
            billing_zip_code: values.zip_code1,
            billing_address_type: values.Billing_address,
        }).then(async (res) => {
            console.log(res.data)
            localStorage.setItem("role", "subscriber")
            localStorage.setItem("password", this.props.values.Password)
            //permanent code
            // this.props.history.push({
            //     pathname: '/plan',
            //     state: { credential: this.props.values }
            // });

            // Remove after some time
            let userlogin = await axios.post(Apis.Userlogin, {
                username: this.props.values.Email,
                password: this.props.values.Password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            toast.success("Signup Successfully")
            localStorage.removeItem("token")
            localStorage.setItem("token", userlogin.data.token)
            let getroles = localStorage.getItem("role")
            if (getroles === "subscriber") {
                this.props.history.push('/m_profile')
            }
            
        }).catch((error) => {
            if (error.response) {
                toast.error(error.response.data.message)
            }
        })


    }


    validateRegisterParam = () => {
        let errors = {};
        if (isMentalhealth(this.props.values)) errors.health = "Please enter Your Mental Health Role List"
        if (isLicensenumber(this.props.values)) errors.licensenumber = "Please enter Your License number"
        if (isLicensestate(this.props.values)) errors.licensestate = "Please enter Your License state"
        if (isLicensexpiration(this.props.values)) errors.licenseexpiry = "Please enter Your License Expiry"
        if (this.props.values.Billing_address === "1") {
            if (isAddress1(this.props.values)) errors.address = "Please enter Your Address"
            if (isStreetaddress1(this.props.values)) errors.street = "Please enter Your Street Address"
            if (validatecountry1(this.props.values)) errors.country = 'Please enter Your Country'
            if (isCity1(this.props.values)) errors.city = "Please enter Your City"
            if (isState1(this.props.values)) errors.state = "Please enter Your State"
            if (isZipcode1(this.props.values)) errors.zip = "Please enter Your Zip Code"
            else if (!Zipcodevalidate1(this.props.values)) errors.zip = "Please enter Correct Your Zip Code"
        }
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    back = (e) => {
        this.props.prevStep();
    }

    componentDidMount() {
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        axios.all([axios.get(Apis.getMentalhealthrole),
        axios.get(Apis.getLicensestateList)])
            .then(axios.spread((fr, sr) => {
                const Capoption1 = {
                    label: "Please select your HealthRole",
                    value: "",
                }
                const Capoption2 = {
                    label: "Please select your License State",
                    value: "",
                }
                fr.data.data.splice(0, 0, Capoption1)
                sr.data.data.splice(0, 0, Capoption2)
                this.setState({
                    healthrolelist: fr.data.data,
                    Licensestatelist: sr.data.data
                })
            }))
            .catch(error => (error));
    }
    getoption = (e) => {
        this.setState({
            Mental_health_role: e.label
        })
    }
    getoptionforstate = (e) => {
        this.setState({
            License_state: e.label
        })
    }

    render() {
        const { values } = this.props
        const { healthrolelist, Mental_health_role, License_state, Licensestatelist } = this.state
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="links">
                            <a href="#" onClick={this.back}><i className="angle-left"></i>Back</a>
                            <NavLink to="/member_login">Log In</NavLink>
                        </div>
                    </div>
                </div>
                <form onSubmit={this.saveAndContinue}>
                    <section className="main-container mid-con">
                        <div className="container-fluid">
                            <div className="content login">
                                <div className="welcome mg-top-0">
                                    <strong>Billing Info</strong>
                                </div>
                                <div className="form-block formBox">
                                    <fieldset className="selectInput">
                                        <span className="placeholder">Mental Health Role</span>

                                        <select className="form-control input__field" name='Mental_health_role' value={values.Mental_health_role} onChange={this.props.handleChange}>
                                            {
                                                healthrolelist && healthrolelist.map((val, index) => (
                                                    <option key={index} value={val.value} >{val.label}</option>
                                                ))
                                            }
                                        </select>
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.health}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">License Number </span>
                                        <input type="text" name="License_number" value={values.License_number} className="form-control input__field" onChange={this.props.handleChange} autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.licensenumber}</label>
                                    </fieldset>
                                    <fieldset className="selectInput">
                                        <span className="placeholder">License State</span>
                                        <select onChange={this.props.handleChange} className="form-control input__field" name="License_state" value={values.License_state}>
                                            {
                                                Licensestatelist && Licensestatelist.map((val, index) => (
                                                    <option key={index} value={val.value} >{val.label}</option>
                                                ))
                                            }
                                        </select>

                                        <label className="error" style={{ display: "block" }}>{this.state.errors.licensestate}</label>
                                    </fieldset>
                                    <fieldset className="date-DatePicker">
                                        <span className="placeholder">License Expiration </span>
                                        <DatePicker
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            selected={values.startDate}
                                            onChange={date => this.props.Datechange(date)}
                                            showMonthYearPicker
                                            showFullMonthYearPicker
                                            showTwoColumnMonthYearPicker
                                        />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.licenseexpiry}</label>
                                    </fieldset>
                                    <div className="radio-block">
                                        <ul>
                                            <li>
                                                <label className="checkbox-label">
                                                    <input type="radio" onChange={this.props.handleChange1} name="Billing_address" value="0" checked={values.Billing_address === "0"} />
                                                    <span className="checkbox-custom"></span>
                                                </label>
                                                <strong>Billing Address</strong>
                                                {
                                                    values.address_line_2 !== "" ? <p>
                                                        {values.address}, {values.address_line_2}, {values.city}, {values.State}, {values.zip_code}
                                                    </p> : <p>
                                                        {values.address}, {values.city}, {values.State}, {values.zip_code}
                                                    </p>
                                                }
                                            </li>
                                            <li>
                                                <label className="checkbox-label">
                                                    <input type="radio" onChange={this.props.handleChange1} checked={values.Billing_address === "1"} value="1" name="Billing_address" />
                                                    <span className="checkbox-custom"></span>
                                                </label>
                                                <p>Use Different Address</p>
                                                {
                                                    values.Billing_address === "1" &&
                                                    <div>
                                                        <fieldset>
                                                            <span className="placeholder">Address</span>
                                                            <input type="text" onChange={this.props.handleChange1} name="address1" value={values.address1} className="form-control input__field" autoComplete="off" />
                                                            <label className="error" style={{ display: "block" }}>{this.state.errors.address}</label>
                                                        </fieldset>
                                                        <fieldset>
                                                            <span className="placeholder">Street Address</span>
                                                            <input type="text" onChange={this.props.handleChange1} name="street_address1" value={values.street_address1} className="form-control input__field" autoComplete="off" />
                                                            <label className="error" style={{ display: "block" }}>{this.state.errors.street}</label>
                                                        </fieldset>
                                                        <fieldset>
                                                            <span className="placeholder">Address Line 2</span>
                                                            <input type="text" onChange={this.props.handleChange1} name="address_line_21" value={values.address_line_21} className="form-control input__field" autoComplete="off" />
                                                            <label className="error" style={{ display: "block" }}>{this.state.errors.street2}</label>
                                                        </fieldset>
                                                        <fieldset className="selectInput">
                                                            <span className="placeholder">Country</span>
                                                            <div>
                                                                <CountryDropdown
                                                                    name="Country1"
                                                                    className="form-control input__field"
                                                                    value={values.Country1}
                                                                    onChange={(val) => this.props.changecountry1(val)} />
                                                            </div>
                                                            <label className="error" style={{ display: "block" }}>{this.state.errors.country}</label>
                                                        </fieldset>
                                                        <fieldset>
                                                            <span className="placeholder">State</span>
                                                            <input type="text" value={values.State1} onChange={this.props.handleChange1} name="State1" className="form-control input__field" autoComplete="off" />
                                                            <label className="error" style={{ display: "block" }}>{this.state.errors.state}</label>
                                                        </fieldset>
                                                        <fieldset>
                                                            <span className="placeholder">City</span>
                                                            <input type="text" value={values.city1} onChange={this.props.handleChange1} name="city1" className="form-control input__field" autoComplete="off" />
                                                            <label className="error" style={{ display: "block" }}>{this.state.errors.city}</label>
                                                        </fieldset>

                                                        <fieldset>
                                                            <span className="placeholder">Zip Code</span>
                                                            <input type="text" onChange={this.props.handleChange1} name="zip_code1" value={values.zip_code1} className="form-control input__field" autoComplete="off" />
                                                            <label className="error" style={{ display: "block" }}>{this.state.errors.zip}</label>
                                                        </fieldset>
                                                    </div>
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="bottom-footer">
                        <div className="container-fluid">
                            <div className="button-block">
                            {/* Make Payment */}
                                <button type="submit" className="btn btn-primary">Next</button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        )
    }
}

export default withRouter(Msignup_billing)

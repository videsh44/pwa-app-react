import React, { Component } from 'react'
import { isfirstname, ValidFirstname, isLastname, ValidLastname, validatecountry, validatecontact, iscontact, isTitle, isCredential, isAddress, isStreetaddress, isStreetline2, isCity, isState, isZipcode, Zipcodevalidate } from '../../Validation/signup'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Redirect } from 'react-router-dom';
import inputPlaceHolders from '../../Helper/Form_control'
import { toast } from 'react-toastify';
import axios from '../../Helper/Instance';
import { isIOSDevice } from '../../Helper/Device_detect'
import Apis from '../../Helper/Apis'

export default class User_location extends Component {
    constructor(props) {
        super(props)
        this.state = {
            address: "",
            street_address: "",
            Country: "",
            city: "",
            State: "",
            zip_code: "",
            address_line_2: "",
            errors: {},
            changeoption: false,
            changesignup: false,
            loader: false
        }

    }

    async componentDidMount() {
        let getId_user = localStorage.getItem("User_id")
        console.log(this.props)
        inputPlaceHolders()
        if (this.props.location.state && this.props.location.state.credential || typeof getId_user !== 'undefined' && getId_user || this.props.location.state && this.props.location.state.personal.user_data.ID) {
            try {
                let getuseraddress = await axios.get('/ca/v1/users', {
                    params: {
                        user_id: getId_user || this.props.location.state.personal.user_data.ID
                    }
                })
                console.log(getuseraddress.data.data)
                if ('caches' in window) {
                    caches.keys().then((names) => {
                        names.forEach(name => {
                            caches.delete(name);
                        })
                    });
                }
                this.setState({
                    address: getuseraddress.data.data.user_other_info.user_address[0],
                    street_address: getuseraddress.data.data.user_other_info.street_address[0],
                    Country: getuseraddress.data.data.user_other_info.user_country[0],
                    city: getuseraddress.data.data.user_other_info.user_city[0],
                    State: getuseraddress.data.data.user_other_info.user_state[0],
                    zip_code: getuseraddress.data.data.user_other_info.user_zip_code[0],
                    address_line_2: getuseraddress.data.data.user_other_info.address_line2[0],
                })
            } catch (error) {

            }
        } else if (this.props.location.state && this.props.location.state.pass && this.props.location.state.personal) {
        }
        // } else {
        //     this.props.history.push('/signup')
        // }
    }

    validateRegisterParam = () => {
        let errors = {};
        if (isAddress(this.state)) errors.address = "Please enter Your Address"
        if (isStreetaddress(this.state)) errors.street = "Please enter Your Street Address"
        if (validatecountry(this.state)) errors.country = 'Please enter Your Country'
        if (isCity(this.state)) errors.city = "Please enter Your City"
        if (isState(this.state)) errors.state = "Please enter Your State"
        if (isZipcode(this.state)) errors.zip = "Please enter Your Zip Code"
        else if (!Zipcodevalidate(this.state)) errors.zip = "Please enter Correct Your Zip Code"
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    changecountry = (val) => {
        this.setState({ Country: val })
    }

    saveAndContinue = async (e) => {
        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        let getId = localStorage.getItem("User_id")
        try {
            if (typeof getId !== 'undefined' && getId || this.props.location.state && this.props.location.state.personal.user_data.ID) {
                let userData1 = {
                    user_id: getId || this.props.location.state.personal.user_data.ID,
                    user_address: this.state.address,
                    street_address: this.state.street_address,
                    user_country: this.state.Country,
                    user_state: this.state.State,
                    user_city: this.state.city,
                    user_zip_code: this.state.zip_code,
                    address_line2: this.state.address_line_2
                };
                let user_location = await axios.post('/ca/v1/addUsers', userData1, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                this.setState({
                    changeoption: true
                })
            }
        } catch (error) {
            if (!error.response) {
                console.log("not internet connection")
            } else {
                toast.error(error.response.data.message)

            }
        }
    }

    back = () => {
        this.setState({
            changesignup: true
        })
    }

    //Remove after some time
    redirectmethod = async () => {
        let userlogin = await axios.post(Apis.Userlogin, {
            username: this.props.location.state.credential.Email,
            password: this.props.location.state.credential.Password
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        toast.success("Signup Successfully")
        localStorage.removeItem("token")
        localStorage.setItem("token", userlogin.data.token)
        let getroles = localStorage.getItem("role")
        if (getroles === "User") {
            this.props.history.push(`/home_page/${this.props.location.state.credential.FirstName + "%20" + this.props.location.state.credential.LastName}`)
        }
    }

    render() {
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        if (this.state.changeoption && this.props.location.state && this.props.location.state.credential || this.state.changeoption && this.props.location.state && this.props.location.state.pass && this.props.location.state.personal || this.state.changeoption) {
            this.redirectmethod()
            
            //permanent code
            // return <Redirect to={{
            //     pathname: '/plan',
            //     state: {
            //         Address_detail: this.state,
            //         credential: this.props.location.state.credential,
            //         pass: this.props.location.state.pass,
            //         personal: this.props.location.state.personal
            //     }
            // }} />
        }
        if (this.state.changesignup && this.props.location.state && this.props.location.state.personal && this.props.location.state.pass) {
            localStorage.setItem("User_id", this.props.location.state.personal.user_data.ID)
            localStorage.setItem("password", this.props.location.state.pass)
            return <Redirect to={{
                pathname: '/signup',
                state: {
                    userId: this.props.location.state.personal.user_data.ID,
                    pass: this.props.location.state.pass
                }
            }} />
        }
        else if (this.props.location.state === undefined) {
            return <Redirect to="/signup" />
        }
        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="links">
                            <a href="#" onClick={this.back}><i className="angle-left"></i>Back</a>
                        </div>
                    </div>
                </div>
                <form onSubmit={this.saveAndContinue}>
                    <section className="main-container mid-con">
                        <div className="container-fluid">
                            <div className="content login">

                                <h3 className="left">Location</h3>
                                <div className="form-block formBox">
                                    <fieldset>
                                        <span className="placeholder">Address</span>
                                        <input type="text" onChange={this.handleChange} name="address" value={this.state.address} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}> {this.state.errors.address}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Street Address</span>
                                        <input type="text" onChange={this.handleChange} name="street_address" value={this.state.street_address} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.street}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Address Line 2</span>
                                        <input type="text" onChange={this.handleChange} name="address_line_2" value={this.state.address_line_2} className="form-control input__field" autoComplete="off" />
                                    </fieldset>
                                    <fieldset className="selectInput">
                                        <span className="placeholder">Country</span>
                                        <div>
                                            <CountryDropdown
                                                name="Country"
                                                className="form-control input__field"
                                                value={this.state.Country}
                                                onChange={(val) => this.changecountry(val)} />
                                        </div>
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.country}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">State</span>
                                        <input type="text" value={this.state.State} onChange={this.handleChange} name="State" className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.state}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">City</span>
                                        <input type="text" value={this.state.city} onChange={this.handleChange} name="city" className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.city}</label>
                                    </fieldset>

                                    <fieldset>
                                        <span className="placeholder">Zip Code</span>
                                        <input type="text" onChange={this.handleChange} name="zip_code" value={this.state.zip_code} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.zip}</label>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="bottom-footer">
                        <div className="container-fluid">
                            <div className="button-block">
                                <button type="submit" className="btn btn-primary" >Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

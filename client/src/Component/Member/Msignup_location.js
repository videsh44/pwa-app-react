import React, { Component } from 'react'
import { isfirstname, ValidFirstname, isLastname, ValidLastname, validatecountry, validatecontact, iscontact, isTitle, isCredential, isAddress, isStreetaddress, validatecustom_category, isStreetline2, isCity, isState, isZipcode, Zipcodevalidate } from '../../Validation/signup'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { withRouter, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import inputPlaceHolders from '../../Helper/Form_control'
import axios from '../../Helper/Instance'
import Select from 'react-select'
import Loader from '../Loader/Loader'
import Apis from '../../Helper/Apis'
class Msignup_location extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            FirstName: "",
            LastName: "",
            credential: "",
            phone: "",
            address: "",
            street_address: "",
            address_line_2: "",
            Country: "",
            custom_category: "",
            city: "",
            State: "",
            zip_code: "",
            isChecked: true,
            u_id: "",
            category_m: [],
            errors: {},
            loader: false
        }
    }

    saveAndContinue = (e) => {
        e.preventDefault();
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        var userData = {
            user_id: this.state.u_id ? this.state.u_id : null,
            account: this.props.values.Account,
            first_name: this.props.values.FirstName,
            last_name: this.props.values.LastName,
            email: this.props.values.Email,
            password: this.props.values.Password,
            gender: this.props.values.Gender,
            user_title: this.props.values.title,
            custom_category: this.props.values.custom_category,
            category: this.props.values.selectedValue,
            phone_number: this.props.values.phone,
            user_address: this.props.values.address,
            street_address: this.props.values.street_address,
            address_line2: this.props.values.address_line_2,
            user_country: this.props.values.Country,
            user_state: this.props.values.State,
            user_city: this.props.values.city,
            user_zip_code: this.props.values.zip_code,
            hide_address_status: this.props.values.isChecked
        };
        this.setState({
            loader: true
        })
        fetch(Apis.addUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        }).then(r => r.json()).then(res => {
            if (res.error === 0) {
                if (this.state.u_id) {
                    toast.success("Update Successfully");
                } else {
                    toast.success(res.msg);
                }
                //clear state
                localStorage.setItem("password", this.props.values.Password)
                localStorage.setItem('User_id', res.data.user_data.ID)
                localStorage.setItem("role", "subscriber")
                this.setState({
                    loader: false
                })
                this.props.nextStep();
            } else {
                // when something went wrong
                console.log(res.msg[0])
                if (res.msg[0] === "Sorry, that email address is already used!" || res.msg[0] === "Sorry, that username already exists!") {
                    toast.error("Sorry, that email address is already used!")
                    this.setState({
                        loader: false
                    })
                }
            }
        })
        console.log(this.props.values)
    }

    back = (e) => {
        e.preventDefault();
        this.props.prevStep();
    }


    componentDidMount() {
        if (this.props.values.user_id) {
            this.setState({
                u_id: this.props.values.user_id
            })
        } else {
            let user_id = localStorage.getItem('User_id')
            if (user_id) {
                this.setState({
                    u_id: user_id
                })
            }
        }
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        this.getAllCategories()
    }


    validateRegisterParam = () => {
        let errors = {};
        if (isTitle(this.props.values)) errors.title = "Please enter title"
        if (isCredential(this.props.values)) errors.credential = "Please enter Your Category"
        if (this.props.values.allvaluefromcategory.find(val => val.label === "Other")) {
            if (validatecustom_category(this.props.values)) errors.custom_category = "Please add your categories"
        }
        if (iscontact(this.props.values)) errors.phone = "Please enter phone number"
        else if (!validatecontact(this.props.values)) errors.phone = "Please enter correct phone number"
        if (isAddress(this.props.values)) errors.address = "Please enter Your Address"
        if (isStreetaddress(this.props.values)) errors.street = "Please enter Your Street Address"
        if (validatecountry(this.props.values)) errors.country = 'Please enter Your Country'
        if (isCity(this.props.values)) errors.city = "Please enter Your City"
        if (isState(this.props.values)) errors.state = "Please enter Your State"
        if (isZipcode(this.props.values)) errors.zip = "Please enter Your Zip Code"
        else if (!Zipcodevalidate(this.props.values)) errors.zip = "Please enter Correct Your Zip Code"
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    getAllCategories = async () => {
        try {
            let category = await axios.get('/ca/v1/getCategoryList')
            let data = category.data.data
            this.setState({ category_m: data.reverse() })

        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { values } = this.props
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        if (this.state.loader) {
            return <Loader />
        }
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
                                    <strong>Name &amp; Location</strong>
                                    Join Now- it's free & easy!
                                </div>
                                <div className="form-block formBox">
                                    <input type="hidden" name="u_id" value={this.state.u_id} />
                                    <fieldset className="selectInput">
                                        <span className="placeholder">Title</span>
                                        <select onChange={this.props.handleChange} className="form-control input__field" name="title" value={values.title}>
                                            <option value="">Please select your Title</option>
                                            <option value="Dr">Dr.</option>
                                            <option value="Drs.">Drs.</option>
                                            <option value="Drss.">Drss.</option>
                                        </select>
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.title}</label>
                                    </fieldset>
                                    <fieldset className="selectInput">
                                        <span className="placeholder">Category</span>
                                        <Select
                                            value={values.allvaluefromcategory}
                                            onChange={(e) => this.props.changeoption(e)}
                                            options={this.state.category_m}
                                            isMulti={true}
                                            isClearable
                                        />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.credential}</label>
                                    </fieldset>
                                    {
                                        values.allvaluefromcategory.find(val => val.label === "Other") !== undefined && <>
                                            <h5 className="left">Add Categories</h5>
                                            <fieldset>
                                                <input type="text" onChange={this.props.handleChange} name="custom_category" value={values.custom_category} className="form-control input__field" autoComplete="off" />
                                                <label className="error" style={{ display: "block" }}>{this.state.errors.custom_category}</label>
                                            </fieldset>
                                        </>
                                    }
                                    <fieldset>
                                        <span className="placeholder">Phone</span>
                                        <input type="number" value={values.phone} onChange={this.props.handleChange} name="phone" className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.phone}</label>
                                    </fieldset>
                                    <h3 className="left">Location</h3>
                                    <fieldset>
                                        <span className="placeholder">Address</span>
                                        <input type="text" onChange={this.props.handleChange} name="address" value={values.address} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.address}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Street Address</span>
                                        <input type="text" onChange={this.props.handleChange} name="street_address" value={values.street_address} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.street}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Address Line 2</span>
                                        <input type="text" onChange={this.props.handleChange} name="address_line_2" value={values.address_line_2} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.street2}</label>
                                    </fieldset>
                                    <fieldset className="selectInput">
                                        <span className="placeholder">Country</span>
                                        <div>
                                            <CountryDropdown
                                                name="Country"
                                                className="form-control input__field"
                                                value={values.Country}
                                                onChange={(val) => this.props.changecountry(val)} />
                                        </div>
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.country}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">State</span>
                                        <input type="text" value={values.State} onChange={this.props.handleChange} name="State" className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.state}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">City</span>
                                        <input type="text" value={values.city} onChange={this.props.handleChange} name="city" className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.city}</label>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Zip Code</span>
                                        <input type="text" onChange={this.props.handleChange} name="zip_code" value={values.zip_code} className="form-control input__field" autoComplete="off" />
                                        <label className="error" style={{ display: "block" }}>{this.state.errors.zip}</label>
                                    </fieldset>
                                    <div className="checkbox">
                                        <label className="checkbox-label">
                                            <input type="checkbox" checked={values.isChecked}
                                                onChange={this.props.handleChange} />
                                            <span className="checkbox-custom"></span>
                                        </label>
                                        Hide address from public view
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="bottom-footer">
                        <div className="container-fluid">
                            <div className="button-block">
                                <button type="submit" className="btn btn-primary" >Next</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(Msignup_location)







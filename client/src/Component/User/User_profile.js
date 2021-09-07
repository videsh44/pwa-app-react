import React, { Component } from 'react'
import axios from '../../Helper/Instance';
import { isfirstname, ValidFirstname, isLastname, isAddress, ValidLastname, isEmail, iscontact, validatecontact, validateEmail, isPassword, validatepassowrd, validategender, validateaccount, validatecountry, isStreetaddress, isStreetline2, isCity, isState, isZipcode, Zipcodevalidate } from '../../Validation/signup'
import cate_icon from '../../assets/images/cate-icon1.png'
import inputPlaceHolders from '../../Helper/Form_control'
import logo from '../../assets/images/edit.png'
import bell from '../../assets/images/bell-icon.png';
import applogo from '../../assets/images/logo.png'
import { toast } from 'react-toastify'
import { NavLink } from 'react-router-dom'
import { Unreadnotification } from '../../Helper/ProfileApi'
import location from '../../assets/images/location.png'
import { userprofiledata } from '../../Helper/ProfileApi'
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import Loader from '../Loader/Loader'
import { config } from '@fortawesome/fontawesome-svg-core';
import { isIOSDevice } from '../../Helper/Device_detect'
import Resizer from "react-image-file-resizer";
import noimage from '../../assets/images/download.png'

export default class User_profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            roles: "",
            user_image: null,
            FirstName: "",
            LastName: "",
            Email: "",
            image_url: "",
            Gender: "",
            phone: "",
            unread: "",
            displayname: "",
            address: "",
            street_address: "",
            address_line_2: "",
            city: "",
            State: "",
            zip_code: "",
            Country: "",
            errors: {},
            editable: true,
            loader: true,
            error: null,
        }
        this.token = localStorage.getItem('token')
        let params = (new URL(document.location)).searchParams
        if (params.has('token') || params.has('roletype')) {
            this.web_token = params.get('token')

        }
    }

    validateRegisterParam = () => {
        let errors = {};
        if (isfirstname(this.state)) errors.Firstname = 'Please enter you Firstname'
        else if (!ValidFirstname(this.state)) errors.Firstname = 'Name should be Char.';
        if (isLastname(this.state)) errors.Lastname = 'Please enter you Lastname';
        else if (!ValidLastname(this.state)) errors.Lastname = 'Name should be Char.';
        if (iscontact(this.state)) errors.phone = "Please enter phone number"
        else if (!validatecontact(this.state)) errors.phone = "Please enter correct phone number"
        if (isEmail(this.state)) errors.Email = 'Please enter email.';
        else if (!validateEmail(this.state)) errors.Email = 'Please enter valid email.';
        if (validategender(this.state)) errors.gender = 'Please enter Your Gender'
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

    async componentDidMount() {
        let unread_message = await Unreadnotification()
        if (unread_message !== undefined) {
            let total_count = unread_message.Announcement_Event
            await this.setState({
                unread: total_count
            })
        }
        setInterval(async () => {
            let unread_message = await Unreadnotification()
            if (unread_message !== undefined) {
                let total_count = unread_message.Announcement_Event
                await this.setState({
                    unread: total_count
                })
            }
        }, 30000);
        setTimeout(() => {
            inputPlaceHolders()
        }, 0)
        this.Getallprofilevalue()
    }


    Getallprofilevalue = async () => {
        var config = {};
        if (this.token !== null) {
            var config = {
                "Authorization": `Bearer ${this.token}`
            }
        } else if (this.web_token !== undefined) {
            var config = {
                "Authorization": `Bearer ${this.web_token}`
            }
        }

        try {
            let userdetail = await axios.get('/ca/v1/getProfile', { headers: config })
            let editable_mode = JSON.parse(localStorage.getItem("user_editable"))
            if (editable_mode === null) {
                this.setState({
                    editable: true
                })
            } else if (editable_mode != null) {
                this.setState({
                    editable: editable_mode
                })
            }
            console.log(userdetail.data.data)
            await setTimeout(() => {
                this.setState({
                    displayname: userdetail.data.data.user_data.data.display_name,
                    FirstName: userdetail.data.data.user_other_info.first_name[0],
                    LastName: userdetail.data.data.user_other_info.last_name[0],
                    Email: userdetail.data.data.user_other_info.nickname[0],
                    Gender: userdetail.data.data.user_other_info.gender[0],
                    phone: userdetail.data.data.user_other_info.dbem_phone[0],
                    address: userdetail.data.data.user_other_info.user_address[0],
                    street_address: userdetail.data.data.user_other_info.street_address[0],
                    city: userdetail.data.data.user_other_info.user_city[0],
                    State: userdetail.data.data.user_other_info.user_state[0],
                    zip_code: userdetail.data.data.user_other_info.user_zip_code[0],
                    Country: userdetail.data.data.user_other_info.user_country[0],
                    address_line_2: userdetail.data.data.user_other_info.address_line2[0],
                    image_url: userdetail.data.data.image_url,
                    errors: {},
                    loader: false
                })
            }, 4000)
        } catch (error) {
            if (!error.response) {
                this.setState({
                    loader: false,
                })
            }
            else {
                toast.error(error.response.data.message)
            }
        }
    }

    resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                300,
                300,
                "JPEG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
            );
        });

    dataURIToBlob = (dataURI) => {
        const splitDataURI = dataURI.split(",");
        const byteString =
            splitDataURI[0].indexOf("base64") >= 0
                ? atob(splitDataURI[1])
                : decodeURI(splitDataURI[1]);
        const mimeString = splitDataURI[0].split(":")[1].split(";")[0];
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        return new Blob([ia], { type: mimeString });
    };

    getVal = async (e) => {
        if (e.target.type === "file") {
            let file = e.target.files[0];
            if (file) {
                let image = await this.resizeFile(file);
                let newFile = this.dataURIToBlob(image);
                newFile["name"] = file.name
                this.setState({ user_image: newFile });
            }
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    changecountry = (val) => {
        this.setState({
            Country: val
        })
    }

    User_profile_submit = async (e) => {
        var config = {};
        if (this.token !== null) {
            var config = {
                "Authorization": `Bearer ${this.token}`
            }
        } else if (this.web_token !== undefined) {
            var config = {
                "Authorization": `Bearer ${this.web_token}`
            }
        }
        e.preventDefault()
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        let form_data = new FormData();
        form_data.append('user_image', this.state.user_image);
        form_data.append('first_name', this.state.FirstName);
        form_data.append('last_name', this.state.LastName);
        form_data.append('gender', this.state.Gender);
        form_data.append('user_address', this.state.address);
        form_data.append('street_address', this.state.street_address);
        form_data.append('address_line2', this.state.address_line_2);
        form_data.append('user_country', this.state.Country);
        form_data.append('user_state', this.state.State);
        form_data.append('user_city', this.state.city);
        form_data.append('user_zip_code', this.state.zip_code);
        form_data.append('phone_number', this.state.phone);
        try {
            let updateuser = await axios.post('/ca/v1/updateProfile', form_data, { headers: config })
            this.setState({ loader: true })

            localStorage.setItem("user_editable", false)
            if ('caches' in window) {
                caches.keys().then((names) => {
                    names.forEach(name => {
                        caches.delete(name);
                    })
                });
                window.location.reload(true);
                this.Getallprofilevalue()
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            } else {
                this.setState({ loader: false })
            }
        }
    }

    Editablemode = () => {
        this.setState({
            editable: true
        }, () => {
            localStorage.removeItem("user_editable")
        })
    }

    render() {
        const { roles } = this.state
        setTimeout(() => {
            inputPlaceHolders()
        }, 0)
        if (this.state.loader) {
            return <Loader />
        }
        
        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="flexbox">
                            {
                                isIOSDevice() ? <div className="links">
                                    <a href="#" id="me"><img src={""} /></a>
                                </div> : <div className="links">
                                    <NavLink to={`/home_page/${this.state.displayname}`}><i className="angle-left"></i>Back</NavLink>
                                </div>
                            }
                            <a href="#" className="applogo"><img src={applogo} height="40px" alt="" /></a>
                            <div className="bell">
                                <NavLink to="/notification" ><img src={bell} alt="Bell" /><sup className="badge">{this.state.unread !== 0 && this.state.unread}</sup></NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.editable ? <form onSubmit={this.User_profile_submit}>
                        <section className="main-container mid-con">
                            <div className="container-fluid">
                                <div className="content login">
                                    <div className="welcome mg-top-0">
                                        <strong>{this.state.FirstName}<br /> build your dedicated profile</strong>
                                        <p className="email"><a href="#">{this.state.Email}</a></p>
                                    </div>
                                    <div className="upload-photo">
                                        <figure>{
                                            this.state.image_url ? <img src={this.state.image_url} alt="User" /> : <img src={noimage} alt="User" />
                                        }</figure>
                                        <span>{
                                            this.state.user_image && <small>{this.state.user_image.name}</small>
                                        }</span>
                                        <button type="button" className="btn btn-primary upload-btn" >
                                            <input type="file" accept="image/*" name="user_image" onChange={this.getVal} />Upload Photo
                                        </button>
                                    </div>
                                    <div className="form-block formBox profile">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <fieldset>
                                                    <span className="placeholder">First Name </span>
                                                    <input type="text" name="FirstName" onChange={this.getVal} value={this.state.FirstName} className="form-control input__field" autoComplete="off" />
                                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Firstname}</label>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-6">
                                                <fieldset>
                                                    <span className="placeholder">Last Name </span>
                                                    <input type="text" name="LastName" value={this.state.LastName} onChange={this.getVal} className="form-control input__field" autoComplete="off" />
                                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Lastname}</label>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <fieldset>
                                            <span className="placeholder">Phone</span>
                                            <input type="number" value={this.state.phone} onChange={this.getVal} name="phone" className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.phone}</label>
                                        </fieldset>


                                        <fieldset>
                                            <span className="placeholder">Type your Email id</span>
                                            <input type="text" name="Email" readOnly={true} value={this.state.Email} onChange={this.getVal} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                        </fieldset>
                                        <h3 className="left">Gender</h3>
                                        <div className="gender-block">
                                            <ul>
                                                <li>
                                                    <label className="checkbox-label">
                                                        <input type="radio" value="Male" checked={this.state.Gender === "Male"} onChange={this.getVal} name="Gender" />
                                                        <span className="checkbox-custom"></span>
                                                    </label>
                                                    Male
                                                </li>
                                                <li>
                                                    <label className="checkbox-label">
                                                        <input type="radio" value="Female" checked={this.state.Gender === "Female"} onChange={this.getVal} name="Gender" />
                                                        <span className="checkbox-custom"></span>
                                                    </label>
                                                    Female
                                                </li>
                                                <li>
                                                    <label className="checkbox-label">
                                                        <input type="radio" value="Others" checked={this.state.Gender === "Others"} onChange={this.getVal} name="Gender" />
                                                        <span className="checkbox-custom"></span>
                                                    </label>
                                                    Other
                                                </li>
                                            </ul>
                                            <label className="error" style={{ display: "block", color: "red", fontSize: "12px", position: "relative", top: "auto" }}>{this.state.errors.gender}</label>
                                        </div>
                                        <h3 className="left">Location</h3>
                                        <fieldset>
                                            <span className="placeholder">Address</span>
                                            <input type="text" onChange={this.handleChange} name="address" value={this.state.address} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.address}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">Street Address</span>
                                            <input type="text" onChange={this.handleChange} name="street_address" value={this.state.street_address} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.street}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">Address Line 2</span>
                                            <input type="text" onChange={this.handleChange} name="address_line_2" value={this.state.address_line_2} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.street2}</label>
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
                                            <span className="placeholder">City</span>
                                            <input type="text" value={this.state.city} onChange={this.handleChange} name="city" className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.city}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">State</span>
                                            <input type="text" value={this.state.State} onChange={this.handleChange} name="State" className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.state}</label>
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
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </div>
                            </div>
                        </div>
                    </form> : <form onSubmit={this.User_profile_submit}>
                        <section className="main-container mid-con">
                            <div className="container-fluid">
                                <div className="content login">
                                    <div className="welcome mg-top-0">
                                        <strong>{this.state.FirstName}<br /> build your dedicated profile</strong>
                                        <p className="email"><a href="#">{this.state.Email}<img src={logo} alt="Edit" onClick={this.Editablemode} /></a></p>
                                    </div>
                                    <div className="upload-photo">
                                        <figure>{
                                            this.state.image_url ? <img src={this.state.image_url} alt="User" /> : <img src={noimage} alt="User" />
                                        }</figure>
                                        <span>{
                                            this.state.user_image && <small>{this.state.user_image.name}</small>
                                        }</span>
                                        {/* <button type="button" className="btn btn-primary upload-btn" >
                                            <input type="file" disabled name="user_image" onChange={this.getVal} />Upload Photo
                                          </button> */}
                                    </div>
                                    <div className="form-block formBox profile">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <fieldset>
                                                    <span className="placeholder">First Name </span>
                                                    <input type="text" readOnly name="FirstName" onChange={this.getVal} value={this.state.FirstName} className="form-control input__field" autoComplete="off" />
                                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Firstname}</label>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-6">
                                                <fieldset>
                                                    <span className="placeholder">Last Name </span>
                                                    <input type="text" name="LastName" readOnly value={this.state.LastName} onChange={this.getVal} className="form-control input__field" autoComplete="off" />
                                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Lastname}</label>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <fieldset>
                                            <span className="placeholder">Phone</span>
                                            <input type="number" readOnly value={this.state.phone} onChange={this.getVal} name="phone" className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.phone}</label>
                                        </fieldset>


                                        <fieldset>
                                            <span className="placeholder">Type your Email id</span>
                                            <input type="text" readOnly name="Email" readOnly={true} value={this.state.Email} onChange={this.getVal} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                        </fieldset>
                                        <h3 className="left">Gender</h3>
                                        <div className="gender-block">
                                            <ul>
                                                <li>
                                                    <label className="checkbox-label">
                                                        <input type="radio" disabled value="Male" checked={this.state.Gender === "Male"} onChange={this.getVal} name="Gender" />
                                                        <span className="checkbox-custom"></span>
                                                    </label>
                                                    Male
                                                </li>
                                                <li>
                                                    <label className="checkbox-label">
                                                        <input type="radio" disabled value="Female" checked={this.state.Gender === "Female"} onChange={this.getVal} name="Gender" />
                                                        <span className="checkbox-custom"></span>
                                                    </label>
                                                    Female
                                                </li>
                                                <li>
                                                    <label className="checkbox-label">
                                                        <input type="radio" disabled value="Others" checked={this.state.Gender === "Others"} onChange={this.getVal} name="Gender" />
                                                        <span className="checkbox-custom"></span>
                                                    </label>
                                                    Other
                                                </li>
                                            </ul>
                                            <label className="error" style={{ display: "block", color: "red", fontSize: "12px", position: "relative", top: "auto" }}>{this.state.errors.gender}</label>
                                        </div>
                                        <h3 className="left">Location</h3>
                                        <fieldset>
                                            <span className="placeholder">Address</span>
                                            <input type="text" readOnly onChange={this.handleChange} name="address" value={this.state.address} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.address}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">Street Address</span>
                                            <input type="text" readOnly onChange={this.handleChange} name="street_address" value={this.state.street_address} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.street}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">Address Line 2</span>
                                            <input type="text" readOnly onChange={this.handleChange} name="address_line_2" value={this.state.address_line_2} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.street2}</label>
                                        </fieldset>
                                        <fieldset className="selectInput">
                                            <span className="placeholder">Country</span>
                                            <div>
                                                <CountryDropdown
                                                    disabled
                                                    name="Country"
                                                    className="form-control input__field"
                                                    value={this.state.Country}
                                                    onChange={(val) => this.changecountry(val)} />
                                            </div>
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.country}</label>
                                        </fieldset>

                                        <fieldset>
                                            <span className="placeholder">City</span>
                                            <input type="text" readOnly value={this.state.city} onChange={this.handleChange} name="city" className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.city}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">State</span>
                                            <input type="text" readOnly value={this.state.State} onChange={this.handleChange} name="State" className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.state}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">Zip Code</span>
                                            <input type="text" readOnly onChange={this.handleChange} name="zip_code" value={this.state.zip_code} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.zip}</label>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="bottom-footer">
                            <div className="container-fluid">
                                <div className="button-block">
                                    <button type="submit" className="btn btn-primary" disabled>Save</button>
                                </div>
                            </div>
                        </div>
                    </form>
                }
            </div>
        )
    }
}

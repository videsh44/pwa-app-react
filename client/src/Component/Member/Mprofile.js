import React, { Component, PureComponent } from 'react'
import inputPlaceHolders from '../../Helper/Form_control'
import { checkNumberFieldLength, checkregistrationfieldlength } from '../../Helper/Edu_validation'
import { isAddress, validategender, validateYear, isProtoca, validateprotoca, isBoardcertification, isSchool, isCategory, isAbout, isAmount, validateAmount, validatecountry, isStreetaddress, validatecustom_category, isStreetline2, isCity, isState, isZipcode, Zipcodevalidate } from '../../Validation/signup'
import location from '../../assets/images/location.png'
import logo from '../../assets/images/edit.png'
import { toast } from 'react-toastify'
import axios from '../../Helper/Instance'
import sidemenu from '../../Helper/Sidemenu'
import Sidebar from '../Sidebar'
import hemburger from '../../assets/images/hemburger-icon.png'
import Loader from '../Loader/Loader'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from "react-router-dom";
import bell from '../../assets/images/bell-icon.png'
import { Button, Modal } from 'react-bootstrap'
import { Unreadnotification } from '../../Helper/ProfileApi'
import GoogleMapReact from 'google-map-react';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import Geocode from "react-geocode";
import { isIOSDevice } from '../../Helper/Device_detect'
import applogo from '../../assets/images/logo.png'
import Resizer from "react-image-file-resizer";
import noimage from '../../assets/images/download.png'

const minOffset = 0;
const maxOffset = 50;
const AnyReactComponent = ({ text }) => (
    <div></div>
);
export default class Mprofile extends PureComponent {
    constructor(props) {
        super(props)
        this.thisYear = (new Date()).getFullYear();
        this.state = {
            user_image: null,
            image_url: "",
            graduate_year: "",
            Protoca_year: "",
            nickname: "",
            firstname: "",
            board_certification: "",
            School: "",
            address: "",
            street_address: "",
            address_line_2: "",
            city: "",
            State: "",
            zip_code: "",
            custom_category: "",
            Country: "",
            category: [],
            Gender: "",
            amount: "",
            unread: "",
            about: "",
            editable: true,
            hide_address: "",
            categorylist: [],
            show: false,
            errors: {},
            selectedValue: [],
            loader: true
        }
        this.token = localStorage.getItem("token")
        let params = (new URL(document.location)).searchParams
        if (params.has('token') || params.has('roletype')) {
            this.web_token = params.get('token')
            this.roletype = params.get("roletype")
            localStorage.setItem("webtoken", this.web_token)
            localStorage.setItem("webrole", this.roletype)
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

    handleClose = () => {
        this.setState({
            show: false
        })
    }

    handleShow = () => {
        this.setState({
            show: true
        })
    }
    getoption = (e) => {
        this.setState({
            graduate_year: e.value
        })
    }

    validateRegisterParam = () => {
        let errors = {};
        if (validateYear(this.state)) errors.year = 'Please enter you Graduate Year'
        else if (isProtoca(this.state)) errors.protoca = 'Please enter Your Practice Year'
        if (!validateprotoca(this.state)) errors.protoca = 'Please enter Valid Practice Year'
        if (isBoardcertification(this.state)) errors.certification = 'Please enter Your Board Certification'
        if (isSchool(this.state)) errors.school = 'Please enter Your School'
        if (this.state.hide_address == "") {
            if (isAddress(this.state)) errors.address = "Please enter Your Address"
            if (isStreetaddress(this.state)) errors.street = "Please enter Your Street Address"
            if (validatecountry(this.state)) errors.country = 'Please enter Your Country'
            if (isCity(this.state)) errors.city = "Please enter Your City"
            if (isState(this.state)) errors.state = "Please enter Your State"
            if (isZipcode(this.state)) errors.zip = "Please enter Your Zip Code"
            else if (!Zipcodevalidate(this.state)) errors.zip = "Please enter Correct Your Zip Code"
        }
        if (isCategory(this.state)) errors.specilities = 'Please enter Your Categoty'
        if (this.state.category.find(val => val.label === "Other")) {
            if (validatecustom_category(this.state)) errors.custom_category = "Please add your categories"
        }
        if (validategender(this.state)) errors.gender = 'Please enter Your Gender'
        if (isAmount(this.state)) errors.amount = 'Please enter your Amount'
        else if (!validateAmount(this.state)) errors.amount = 'Please enter Valid Amount'
        if (isAbout(this.state)) errors.about = 'Please tell me About Yourself'
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    async componentDidMount() {
        this.Getallmemberprofilevalue()
        this.getAllCategories()
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
        }, 0);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getAllCategories = async () => {
        try {
            let category = await axios.get('/ca/v1/getCategoryList')
            let data = category.data.data
            this.setState({ categorylist: data.reverse() })
        } catch (error) {
            if (!error.response) {
                this.setState({
                    loader: false,
                })
            } else {
                toast.error(error.response.data.message)
            }
        }
    }

    Getallmemberprofilevalue = async () => {
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
            let memberdata = await axios.get('/ca/v1/getProfile',
                {
                    headers: config
                })
            let editable_mode = JSON.parse(localStorage.getItem("editable"))
            if (editable_mode === null) {
                this.setState({
                    editable: true
                })
            } else if (editable_mode != null) {
                this.setState({
                    editable: editable_mode
                })
            }
            console.log(memberdata.data.data.user_other_info)
            if (!memberdata.data.data.user_other_info.hasOwnProperty('qa_board_certification') && !memberdata.data.data.user_other_info.hasOwnProperty('qa_school') && !memberdata.data.data.user_other_info.hasOwnProperty('category') && !memberdata.data.data.user_other_info.hasOwnProperty('finance_cost_per_session') && !memberdata.data.data.user_other_info.hasOwnProperty('member_about_des')) {
                this.setState({
                    graduate_year: "",
                    Protoca_year: "",
                    registraion_number: "",
                    board_certification: "",
                    School: "",
                    address: memberdata.data.data.user_other_info.user_address[0],
                    street_address: memberdata.data.data.user_other_info.street_address[0],
                    city: memberdata.data.data.user_other_info.user_city[0],
                    custom_category: memberdata.data.data.user_other_info.custom_category[0],
                    State: memberdata.data.data.user_other_info.user_state[0],
                    zip_code: memberdata.data.data.user_other_info.user_zip_code[0],
                    Country: memberdata.data.data.user_other_info.user_country[0],
                    address_line_2: memberdata.data.data.user_other_info.address_line2[0],
                    category: memberdata.data.data.category_name.data,
                    amount: "",
                    about: "",
                    selectedValue: memberdata.data.data.category_name.data.map(val => val.value),
                    Gender: memberdata.data.data.user_other_info.gender[0],
                    image_url: "",
                    hide_address: memberdata.data.data.user_other_info.hide_address_status[0],
                    nickname: memberdata.data.data.user_other_info.nickname[0],
                    firstname: memberdata.data.data.user_other_info.first_name[0],
                    loader: false
                })
            } else {
                await setTimeout(() => {
                    this.setState({
                        graduate_year: memberdata.data.data.user_other_info.graduate_year[0],
                        Protoca_year: memberdata.data.data.user_other_info.years_protoca[0],
                        registraion_number: memberdata.data.data.user_other_info.qa_registration_number[0],
                        board_certification: memberdata.data.data.user_other_info.qa_board_certification[0],
                        School: memberdata.data.data.user_other_info.qa_school[0],
                        address: memberdata.data.data.user_other_info.user_address[0],
                        custom_category: memberdata.data.data.user_other_info.custom_category[0],
                        street_address: memberdata.data.data.user_other_info.street_address[0],
                        city: memberdata.data.data.user_other_info.user_city[0],
                        State: memberdata.data.data.user_other_info.user_state[0],
                        zip_code: memberdata.data.data.user_other_info.user_zip_code[0],
                        Country: memberdata.data.data.user_other_info.user_country[0],
                        address_line_2: memberdata.data.data.user_other_info.address_line2[0],
                        category: memberdata.data.data.category_name.data,
                        amount: memberdata.data.data.user_other_info.finance_cost_per_session[0],
                        about: memberdata.data.data.user_other_info.member_about_des[0],
                        Gender: memberdata.data.data.user_other_info.gender[0],
                        hide_address: memberdata.data.data.user_other_info.hide_address_status[0],
                        image_url: memberdata.data.data.image_url,
                        nickname: memberdata.data.data.user_other_info.nickname[0],
                        firstname: memberdata.data.data.user_other_info.first_name[0],
                        selectedValue: memberdata.data.data.category_name.data.map(val => val.value),
                        errors: {},
                        loader: false
                    }, () => {

                    })
                }, 4000)
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            }
        }
    }

    member_profilesubmit = async (e) => {
        e.preventDefault()
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
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return true;
        }
        let form_data = new FormData();
        form_data.append('user_image', this.state.user_image);
        form_data.append('graduate_year', this.state.graduate_year);
        form_data.append('years_protoca', this.state.Protoca_year);
        form_data.append('gender', this.state.Gender);
        form_data.append('qa_registration_number', this.state.registraion_number);
        form_data.append('qa_board_certification', this.state.board_certification);
        form_data.append('qa_school', this.state.School);
        form_data.append('user_address', this.state.address);
        form_data.append('custom_category', this.state.custom_category);
        form_data.append('street_address', this.state.street_address);
        form_data.append('address_line2', this.state.address_line_2);
        form_data.append('user_country', this.state.Country);
        form_data.append('user_state', this.state.State);
        form_data.append('user_city', this.state.city);
        form_data.append('user_zip_code', this.state.zip_code);
        form_data.append('category', this.state.selectedValue);
        form_data.append('finance_cost_per_session', this.state.amount);
        form_data.append('member_about_des', this.state.about);
        try {
            let Updatemember = await axios.post('/ca/v1/updateProfile',
                form_data
                ,
                {
                    headers: config
                })
            await this.setState({
                loader: true,
            })
            localStorage.setItem("editable", false)
            if ('caches' in window) {
                caches.keys().then((names) => {
                    names.forEach(name => {
                        caches.delete(name);
                    })
                });
                window.location.reload(true);
                this.Getallmemberprofilevalue()
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            }
        }

    }

    changetoEditable = () => {
        this.setState({
            editable: true
        }, () => {
            localStorage.removeItem("editable")
        })
    }

    changeoption = e => {
        this.setState({
            selectedValue: Array.isArray(e) ? e.map(x => x.value) : [],
            category: Array.isArray(e) ? e.map(x => x) : []
        })
    };

    changecountry = (val) => {
        this.setState({
            Country: val
        })
    }

    render() {
        setTimeout(() => {
            inputPlaceHolders()
            sidemenu()
        }, 0);

        const options = [{
            label: "Graduate Year",
            value: "",
        }];

        for (let i = minOffset; i <= maxOffset; i++) {
            const year = this.thisYear - i;
            let opt = {
                label: year,
                value: year,
            }
            options.push(opt)
        }
        if (this.state.loader) {
            return <Loader />
        }
        return (
            <div>
                <Sidebar />
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="flexbox">
                            {
                                isIOSDevice() ? <div className="links">
                                    <a href="#" id="me"><img src={""} /></a>
                                </div> : <div className="links">
                                    <a href="#" id="menuBtn"><img src={hemburger} alt="Hemburger" /></a>
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
                    this.state.editable ? <form onSubmit={this.member_profilesubmit}>
                        <section className="main-container mid-con">
                            <div className="container-fluid">
                                <div className="content login">
                                    <div className="welcome mg-top-0">
                                        <strong>Hello {this.state.firstname}<br /> build your dedicated profile</strong>
                                        <p className="email"><a href="#">{this.state.nickname}</a></p>
                                    </div>
                                    <div className="upload-photo">
                                        <figure>{
                                            this.state.image_url ? <img src={this.state.image_url} alt="User" /> : <img src={noimage} alt="User" />
                                        }</figure>
                                        <span>{
                                            this.state.user_image && <small>{this.state.user_image.name}</small>
                                        }</span>
                                        <button type="button" className="btn btn-primary upload-btn">
                                            <input type="file" accept="image/*" name="member_image" onChange={this.getVal} />Upload Photo
                                        </button>

                                    </div>
                                    <div className="form-block formBox profile">
                                        <h3 className="left">Qualification</h3>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <fieldset className="selectInput">
                                                    <select value={this.state.graduate_year} onChange={this.getVal} className="form-control input__field" name="graduate_year">
                                                        {options.map((option, index) => (
                                                            <option key={index} value={option.value}>{option.label}</option>
                                                        ))}
                                                    </select>
                                                    <label className="error" style={{ display: "block" }}>{this.state.errors.year}</label>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-6">
                                                <fieldset>
                                                    <span className="placeholder"> Practice Year </span>
                                                    <input type="number" onInput={(num) => { checkNumberFieldLength(num) }} name="Protoca_year" onChange={this.getVal} value={this.state.Protoca_year} className="form-control input__field" autoComplete="off"></input>
                                                    <label className="error" style={{ display: "block" }}>{this.state.errors.protoca}</label>
                                                </fieldset>
                                                <br />
                                            </div>
                                        </div>
                                        <fieldset>
                                            <span className="placeholder">Board Certification </span>
                                            <input type="text" value={this.state.board_certification} onChange={this.getVal} name="board_certification" className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.certification}</label>
                                        </fieldset>
                                        <fieldset>
                                            <span className="placeholder">School</span>
                                            <input type="text" name="School" value={this.state.School} onChange={this.getVal} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.school}</label>
                                        </fieldset>
                                        {
                                            this.state.hide_address == "1" ? "" :
                                                <div>
                                                    <h3 className="left">Location</h3>
                                                    <div>
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
                                        }
                                        <h3>Category</h3>
                                        <fieldset className="selectInput">
                                            <Select
                                                value={this.state.category}
                                                onChange={(e) => { this.changeoption(e) }}
                                                options={this.state.categorylist}
                                                isMulti={true}
                                                isClearable
                                            />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.specilities}</label>
                                        </fieldset>
                                        {
                                            this.state.category.find(val => val.label === "Other") !== undefined &&
                                            <>
                                                <h3>Add Categories</h3>
                                                <fieldset className="selectInput">
                                                    <input type="text" onChange={this.getVal} name="custom_category" value={this.state.custom_category} className="form-control input__field" autoComplete="off" />
                                                    <label className="error" style={{ display: "block" }}>{this.state.errors.custom_category}</label>
                                                </fieldset>
                                            </>
                                        }
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
                                        <h3>Finance Cost per session</h3>
                                        <fieldset className="doller">
                                            <i className="fa fa-usd"></i>
                                            <span className="placeholder">Enter Amount</span>
                                            <input type="number" name="amount" onChange={this.getVal} value={this.state.amount} className="form-control input__field" autoComplete="off" />
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.amount}</label>
                                        </fieldset>
                                        <fieldset className="textareaInput">
                                            <span className="placeholder">About You</span>
                                            <textarea className="form-control input__field" cols="30" rows="10" onChange={this.getVal} name="about" value={this.state.about}></textarea>
                                            <label className="error" style={{ display: "block" }}>{this.state.errors.about}</label>
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
                    </form> :
                        <form onSubmit={this.member_profilesubmit}>
                            <section className="main-container mid-con">
                                <div className="container-fluid">
                                    <div className="content login">
                                        <div className="welcome mg-top-0">
                                            <strong>Hello {this.state.firstname}<br /> build your dedicated profile</strong>
                                            <p className="email"><a href="#">{this.state.nickname}<img src={logo} alt="Edit" onClick={this.changetoEditable} /></a></p>
                                        </div>
                                        <div className="upload-photo">
                                            <figure>{

                                                this.state.image_url ? <img src={this.state.image_url} alt="User" /> : <img src={noimage} alt="User" />
                                            }</figure>
                                            {/* <button type="button" className="btn btn-primary upload-btn">
                                                <input type="file" disabled name="member_image" onChange={this.getVal} />Upload Photo
                                                  </button> */}
                                        </div>
                                        <div className="form-block formBox profile">
                                            <h3 className="left">Qualification</h3>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <fieldset className="selectInput">
                                                        <select disabled value={this.state.graduate_year} onChange={this.getVal} className="form-control input__field" name="graduate_year">
                                                            {options.map((option, index) => (
                                                                <option key={index} value={option.value}>{option.label}</option>
                                                            ))}
                                                        </select>

                                                        <label className="error" style={{ display: "block" }}>{this.state.errors.year}</label>
                                                    </fieldset>
                                                </div>
                                                <div className="col-md-6">
                                                    <fieldset>
                                                        <span className="placeholder">Practice Year </span>
                                                        <input type="number" readOnly onInput={(num) => { checkNumberFieldLength(num) }} name="Protoca_year" onChange={this.getVal} value={this.state.Protoca_year} className="form-control input__field" autoComplete="off"></input>
                                                        <label className="error" style={{ display: "block" }}>{this.state.errors.protoca}</label>
                                                    </fieldset>
                                                    <br />
                                                </div>
                                            </div>
                                            <fieldset>
                                                <span className="placeholder">Board Certification </span>
                                                <input type="text" readOnly value={this.state.board_certification} onChange={this.getVal} name="board_certification" className="form-control input__field" autoComplete="off" />
                                                <label className="error" style={{ display: "block" }}>{this.state.errors.certification}</label>
                                            </fieldset>
                                            <fieldset>
                                                <span className="placeholder">School</span>
                                                <input type="text" readOnly name="School" value={this.state.School} onChange={this.getVal} className="form-control input__field" autoComplete="off" />
                                                <label className="error" style={{ display: "block" }}>{this.state.errors.school}</label>
                                            </fieldset>
                                            <fieldset className="selectInput locationSel">
                                                {
                                                    this.state.hide_address == "1" ? "" :
                                                        <div>
                                                            <h3 className="left">Location</h3>
                                                            {/* <button disabled type="button" address={this.state.address} className="map-btn"><img src={location} alt="Location" onClick={this.handleShow} /></button> */}
                                                            <button type="button" address={this.state.address} className="map-btn"><img src={location} alt="Location" onClick={this.handleShow} /></button>
                                                            <label className="error" style={{ display: "block" }}>{this.state.errors.address}</label>
                                                            <div>
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
                                                }
                                            </fieldset>
                                            <h3>Category</h3>
                                            <fieldset className="selectInput">
                                                <Select
                                                    isDisabled={true}
                                                    value={this.state.category}
                                                    onChange={(e) => { this.changeoption(e) }}
                                                    options={this.state.categorylist}
                                                    isMulti={true}
                                                    isClearable
                                                />
                                            </fieldset>
                                            {
                                                this.state.category.find(val => val.label === "Other") !== undefined &&
                                                <>
                                                    <h3>Add Categories</h3>
                                                    <fieldset className="selectInput">
                                                        <input type="text" readOnly onChange={this.getVal} name="custom_category" value={this.state.custom_category} className="form-control input__field" autoComplete="off" />
                                                        <label className="error" style={{ display: "block" }}>{this.state.errors.custom_category}</label>
                                                    </fieldset>
                                                </>
                                            }
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
                                                    <label className="error" style={{ display: "block", color: "red", fontSize: "12px", position: "relative", top: "auto" }}>{this.state.errors.gender}</label>
                                                </ul>

                                            </div>
                                            <h3>Finance Cost per session</h3>
                                            <fieldset className="doller">
                                                <i className="fa fa-usd"></i>
                                                <span className="placeholder">Enter Amount</span>
                                                <input type="number" name="amount" readOnly onChange={this.getVal} value={this.state.amount} className="form-control input__field" autoComplete="off" />
                                                <label className="error" style={{ display: "block" }}>{this.state.errors.amount}</label>
                                            </fieldset>
                                            <fieldset className="textareaInput">
                                                <span className="placeholder">About You</span>
                                                <textarea className="form-control input__field" readOnly cols="30" rows="10" onChange={this.getVal} name="about" value={this.state.about}></textarea>
                                                <label className="error" style={{ display: "block" }}>{this.state.errors.about}</label>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="bottom-footer">
                                <div className="container-fluid">
                                    <div className="button-block">
                                        <button type="submit" disabled className="btn btn-primary">Save</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                }
                <Modal show={this.state.show} onHide={this.handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Address</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Simple todos={this.state.address} />
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}



class Simple extends Component {
    constructor(props) {
        super(props)
        this.marker = null
        this.state = {
            center: { lat: 59.95, lng: 30.33 },
            zoom: 11,
            map: "",
            place: "",
            count: 1
        }
    }

    componentDidUpdate(prevprops, prevstates) {
        if (prevstates.place != prevprops.todos) {
            if (this.props && this.props.todos) {
                Geocode.fromAddress(this.props.todos, "AIzaSyAi8NfcCvGwRH5BtvM4VVluJxockiwyz0I").then(
                    (response) => {
                        const { lat, lng } = response.results[0].geometry.location;
                        this.setState({
                            center: { lat: lat, lng: lng },
                        }, () => {
                            const contentString = this.props.todos
                            const infowindow = new window.google.maps.InfoWindow({
                                content: contentString,
                            });
                            this.marker = new window.google.maps.Marker({
                                position: this.state.center,
                                title: this.props.todos
                            });
                            this.marker.addListener("click", () => {
                                infowindow.open(this.state.map, this.marker);
                            });
                            this.marker.setMap(this.state.map);
                        })
                    },
                    (error) => {
                        if (error.message.includes("Server returned status code ZERO_RESULTS")) {
                            if (this.state.count == 1) {
                                toast.error('Invalid address')
                                this.setState({
                                    count: ++this.state.count
                                })
                            }
                        }
                    }
                );
            }
            this.setState({
                place: prevprops.todos
            })
        }
    }


    handleApiLoaded = (map, maps) => {
        this.setState({
            map: map
        })
        this.marker = new window.google.maps.Marker({
            position: this.state.center,
            title: this.props.todos
        });
        this.marker.setMap(map);
    };
    render() {
        return (
            <div style={{ height: '300px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyAi8NfcCvGwRH5BtvM4VVluJxockiwyz0I" }}
                    defaultCenter={this.state.center}
                    center={this.state.center}
                    defaultZoom={this.state.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}>
                    <AnyReactComponent
                        lat={59.955413}
                        lng={30.337844}
                        text={'Kreyser Avrora'}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}





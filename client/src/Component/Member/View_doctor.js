import React, { Component } from 'react'
import axios from '../../Helper/Instance'
import logo from '../../assets/images/verified-user.png'
import Loader from '../Loader/Loader'
import location from '../../assets/images/location.png'
import Example from '../Member/pop_up'
import { Button, Modal } from 'react-bootstrap'
import GoogleMapReact from 'google-map-react';
import { NavLink } from "react-router-dom";
import bell from '../../assets/images/bell-icon.png';
import mpnlogo from '../../assets/images/logo.png'
import { toast } from 'react-toastify'
import Geocode from "react-geocode";
import noimage from '../../assets/images/download.png'
import { isIOSDevice } from '../../Helper/Device_detect'
const AnyReactComponent = ({ text }) => (
    <div></div>
);

export default class View_doctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            doc_id: "",
            about: "",
            amount: "",
            address: "",
            street_address: "",
            address_line_2: "",
            city: "",
            State: "",
            zip_code: "",
            Country: "",
            category: [],
            imageurl: "",
            license: "",
            custom_category: "",
            Protoca_year: "",
            School: "",
            graduate_year: "",
            board_certification: "",
            count: 0,
            firstname: "",
            show: false,
            contact: "",
            lastname: "",
            hide_address: "",
            nickname: "",
            loader: true
        }
        this.token = localStorage.getItem('token')
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
        }
    }
    async componentDidMount() {
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
            let docval = await axios.get('/ca/v1/users', {
                params: {
                    user_id: this.props.Id.index
                },
                headers: config
            })
            if (!docval.data.data.user_other_info.hasOwnProperty('graduate_year') && !docval.data.data.user_other_info.hasOwnProperty('years_protoca') && !docval.data.data.user_other_info.hasOwnProperty('category_name') && !docval.data.data.user_other_info.hasOwnProperty('finance_cost_per_session') && !docval.data.data.user_other_info.hasOwnProperty('member_about_des')) {
                this.setState({
                    about: "",
                    amount: "",
                    address: docval.data.data.user_other_info.user_address[0],
                    street_address: docval.data.data.user_other_info.street_address[0],
                    city: docval.data.data.user_other_info.user_city[0],
                    State: docval.data.data.user_other_info.user_state[0],
                    zip_code: docval.data.data.user_other_info.user_zip_code[0],
                    address_line_2: docval.data.data.user_other_info.address_line2[0],
                    Country: docval.data.data.user_other_info.user_country[0],
                    custom_category: docval.data.data.user_other_info.custom_category[0],
                    category: docval.data.data.category_name.data,
                    license: "",
                    School: docval.data.data.user_other_info.qa_school[0],
                    imageurl: docval.data.data.image_url,
                    graduate_year: "",
                    board_certification: docval.data.data.user_other_info.qa_board_certification[0],
                    contact: docval.data.data.user_other_info.dbem_phone[0],
                    hide_address: docval.data.data.user_other_info.hide_address_status[0],
                    firstname: docval.data.data.user_other_info.first_name[0],
                    lastname: docval.data.data.user_other_info.last_name[0],
                    nickname: docval.data.data.user_other_info.nickname[0],
                    loader: false
                })
            } else {
                await setTimeout(() => {
                    this.setState({
                        graduate_year: docval.data.data.user_other_info.graduate_year[0],
                        Protoca_year: docval.data.data.user_other_info.years_protoca[0],
                        board_certification: docval.data.data.user_other_info.qa_board_certification[0],
                        School: docval.data.data.user_other_info.qa_school[0],
                        address: docval.data.data.user_other_info.user_address[0],
                        street_address: docval.data.data.user_other_info.street_address[0],
                        city: docval.data.data.user_other_info.user_city[0],
                        State: docval.data.data.user_other_info.user_state[0],
                        zip_code: docval.data.data.user_other_info.user_zip_code[0],
                        custom_category: docval.data.data.user_other_info.custom_category[0],
                        Country: docval.data.data.user_other_info.user_country[0],
                        category: docval.data.data.category_name.data,
                        license: docval.data.data.user_other_info.License_number[0],
                        amount: docval.data.data.user_other_info.finance_cost_per_session[0],
                        address_line_2: docval.data.data.user_other_info.address_line2[0],
                        about: docval.data.data.user_other_info.member_about_des[0],
                        firstname: docval.data.data.user_other_info.first_name[0],
                        lastname: docval.data.data.user_other_info.last_name[0],
                        hide_address: docval.data.data.user_other_info.hide_address_status[0],
                        contact: docval.data.data.user_other_info.dbem_phone[0],
                        nickname: docval.data.data.user_other_info.nickname[0],
                        imageurl: docval.data.data.image_url,
                        loader: false
                    }, () => {
                    })
                }, 5000)
            }
        } catch (error) {
            console.log(error)
        }
    }

    searchdoctor = () => {
        this.props.Id.newfunc()
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    }

    handleShow = async () => {
        if (this.token !== null) {
            this.setState({
                show: true
            })
        } else {
            window.location = `http://maps.apple.com/?address=${this.state.address}&z=10&t=m`
        }
    }

    async componentDidUpdate(prevprops, prevstate) {
        if (this.state.count === 0) {
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
                let docval = await axios.get('/ca/v1/users', {
                    params: {
                        user_id: this.props.Id.index
                    },
                    headers: config
                })
                console.log(docval.data.data.user_other_info)
                if (!docval.data.data.user_other_info.hasOwnProperty('graduate_year') && !docval.data.data.user_other_info.hasOwnProperty('years_protoca') && !docval.data.data.user_other_info.hasOwnProperty('category_name') && !docval.data.data.user_other_info.hasOwnProperty('finance_cost_per_session') && !docval.data.data.user_other_info.hasOwnProperty('member_about_des')) {
                    this.setState({
                        about: "Not found",
                        amount: "Not found",
                        address: docval.data.data.user_other_info.user_address[0],
                        street_address: docval.data.data.user_other_info.street_address[0],
                        city: docval.data.data.user_other_info.user_city[0],
                        State: docval.data.data.user_other_info.user_state[0],
                        zip_code: docval.data.data.user_other_info.user_zip_code[0],
                        Country: docval.data.data.user_other_info.user_country[0],
                        address_line_2: docval.data.data.user_other_info.address_line2[0],
                        custom_category: docval.data.data.user_other_info.custom_category[0],
                        category: docval.data.data.category_name.data,
                        Protoca_year: "Not found",
                        license: "Not found",
                        graduate_year: "Not found",
                        School: docval.data.data.user_other_info.qa_school[0],
                        board_certification: docval.data.data.user_other_info.qa_board_certification[0],
                        contact: docval.data.data.user_other_info.dbem_phone[0],
                        hide_address: docval.data.data.user_other_info.hide_address_status[0],
                        firstname: docval.data.data.user_other_info.first_name[0],
                        lastname: docval.data.data.user_other_info.last_name[0],
                        nickname: docval.data.data.user_other_info.nickname[0],
                        imageurl: docval.data.data.image_url,
                        loader: false
                    })
                } else {
                    await setTimeout(() => {
                        this.setState({
                            graduate_year: docval.data.data.user_other_info.graduate_year[0],
                            Protoca_year: docval.data.data.user_other_info.years_protoca[0],
                            board_certification: docval.data.data.user_other_info.qa_board_certification[0],
                            School: docval.data.data.user_other_info.qa_school[0],
                            address: docval.data.data.user_other_info.user_address[0],
                            street_address: docval.data.data.user_other_info.street_address[0],
                            city: docval.data.data.user_other_info.user_city[0],
                            State: docval.data.data.user_other_info.user_state[0],
                            zip_code: docval.data.data.user_other_info.user_zip_code[0],
                            custom_category: docval.data.data.user_other_info.custom_category[0],
                            Country: docval.data.data.user_other_info.user_country[0],
                            category: docval.data.data.category_name.data,
                            amount: docval.data.data.user_other_info.finance_cost_per_session[0],
                            about: docval.data.data.user_other_info.member_about_des[0],
                            firstname: docval.data.data.user_other_info.first_name[0],
                            license: docval.data.data.user_other_info.License_number[0],
                            contact: docval.data.data.user_other_info.dbem_phone[0],
                            address_line_2: docval.data.data.user_other_info.address_line2[0],
                            hide_address: docval.data.data.user_other_info.hide_address_status[0],
                            lastname: docval.data.data.user_other_info.last_name[0],
                            nickname: docval.data.data.user_other_info.nickname[0],
                            imageurl: docval.data.data.image_url,
                            loader: false
                        })
                    }, 5000)
                }
            } catch (error) {
                console.log(error)
            }
            this.state.count = ++this.state.count
        }
    }
    render() {
        return (
            <div>
                <div className="header">
                    <div className="container-fluid">
                        <div className="inner-con search-doctor">
                            <div className="links">
                                <a href="#!" onClick={this.searchdoctor}><i className="angle-left"></i>Mental Health Professionals Profile</a>
                            </div>
                            <a href="#"><img src={mpnlogo} height="40px" alt="" /></a>
                            {/* <div className="bell">
                                <NavLink to="/notification" ><img src={bell} alt="Bell" /></NavLink>
                            </div> */}
                            {/* <div className="explore">
                                Explore<span>Plus</span>
                            </div> */}
                        </div>
                    </div>
                </div>
                {
                    this.state.loader ? <Loader /> : <section className="main-section">
                        <div className="content-section doctor-section view-doctor">
                            <div className="doctor-list">
                                <ul>
                                    <li>
                                        <div className="list-header">
                                            <div className="left">
                                                <figure>{this.state.imageurl != "" ? <img src={this.state.imageurl} alt={this.state.category} /> : <img src={noimage} alt="any name" />}</figure>
                                                <div className="caption">
                                                    <h3>{this.state.firstname} {this.state.lastname}</h3>
                                                    <h4>
                                                        {
                                                            Array.isArray(this.state.category) ? (this.state.category != "" ? this.state.category.map((value, ind) => (
                                                                value.label === "Other" ? this.state.custom_category : (ind == 0 ? <span key={ind}>{value.label}</span> :
                                                                    <span key={ind}>, {value.label}</span>)
                                                            )) : "Not Defined") : "Not Defined"
                                                        }
                                                        <p>{this.state.board_certification}</p>
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="right">
                                                <a className="btn btn-small-outline"><img src={logo} alt="Verified User" /> Verified</a>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="content-block pb-0">
                                            <h3><strong>About Mental Health Professionals</strong></h3>
                                            <p>{this.state.about}</p>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="content-block pb-0">
                                            <h3><strong>Qualifications</strong></h3>
                                            <div className="qualification-list">
                                                <p><span>Years in Practice:  </span>{this.state.Protoca_year}</p>
                                                <p><span>License:            </span>{this.state.license}</p>
                                                <p><span>School:             </span>{this.state.School}</p>
                                                <p><span>Year Graduated:     </span>{this.state.graduate_year}</p>
                                                <p><span>Board Certification:</span>{this.state.board_certification}</p>
                                            </div>
                                        </div>
                                    </li>
                                    {
                                        this.state.hide_address == "1" ? "" :
                                            <li>
                                                <div className="content-block location-block pb-0">
                                                    <h3><strong>Location</strong></h3>
                                                    <a href="#!" className="btn btn-small-outline view-map-btn" onClick={this.handleShow} ><i className="fa fa-map-marker" aria-hidden="true"></i> View Map</a>
                                                    {
                                                        this.state.address_line_2 != "" ? (this.state.address && this.state.address_line_2 && this.state.street_address && this.state.city && this.state.State && this.state.Country ? <p>
                                                            {this.state.address}, {this.state.address_line_2}, {this.state.street_address}, {this.state.city}, {this.state.State}, {this.state.Country}
                                                            ,{this.state.zip_code}
                                                        </p> : "Not found") : (
                                                            this.state.address && this.state.street_address && this.state.city && this.state.State && this.state.Country ? <p>
                                                                {this.state.address}, {this.state.street_address}, {this.state.city}, {this.state.State}, {this.state.Country}
                                                                ,{this.state.zip_code}
                                                            </p> : "Not found"
                                                        )
                                                    }
                                                </div>
                                            </li>
                                    }
                                    <li>
                                        <div className="content-block pb-0">
                                            <h3><strong>Specialties</strong></h3>
                                            <p>
                                                {
                                                    Array.isArray(this.state.category) ? (this.state.category != "" ? this.state.category.map((value, ind) => (
                                                        value.label === "Other" ? this.state.custom_category : (ind == 0 ? <span key={ind}>{value.label}</span> :
                                                            <span key={ind}>, {value.label}</span>)
                                                    )) : "Not Defined") : "Not Defined"
                                                }
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="content-block pb-0">
                                            <h3><strong>Finances: Cost per Session:&#36; {this.state.amount}</strong></h3>
                                            <p>
                                                Pay By: American Express, Cash, Check, Health Savings Account,
                                                Mastercard, Visa</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <Example number={{ contact: this.state.contact, email: this.state.nickname }} />
                    </section>
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
            if (this.props && this.props.todos !== "") {
                Geocode.fromAddress(this.props.todos, "AIzaSyAi8NfcCvGwRH5BtvM4VVluJxockiwyz0I",).then(
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
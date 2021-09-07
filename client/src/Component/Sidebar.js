import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import axios from '../Helper/Instance';
import { toast } from 'react-toastify'
import noimage from '../assets/images/download.png'

class Sidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FirstName: "",
            phone: "",
            image_url: ""
        }
        this.token = localStorage.getItem('token')
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
            this.web_role = params.get("roletype")
        }
    }

    userlogout = () => {
        localStorage.clear()
        localStorage.removeItem('token')
        localStorage.removeItem('webtoken')
        if ('caches' in window) {
            caches.keys().then((names) => {
                names.forEach(name => {
                    caches.delete(name);
                })
            });
        }
        this.props.history.push('/loginhome')
    }

    formatPhoneNumber = (str) => {
        let cleaned = ('' + str).replace(/\D/g, '');
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            let intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
        }
        return null;
    }

    componentDidMount() {
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

        if (this.token != null || this.web_token !== undefined) {
            axios.get('/ca/v1/getProfile',
                {
                    headers: config
                })
                .then(res => {
                    this.setState({
                        FirstName: res.data.data.user_other_info.first_name[0],
                        phone: this.formatPhoneNumber(res.data.data.user_other_info.dbem_phone[0]),
                        image_url: res.data.data.image_url
                    })
                }).catch((error) => {
                    if (!error.response) {
                        console.log("network issue")
                    }
                    else {
                        toast.error(error.response.data.message)
                    }
                })
        }
    }

    getUserDetail = () => {
        let rolesfind = localStorage.getItem('role')
        if (rolesfind === 'subscriber' || this.web_role === 'subscriber') {
            this.props.history.push("/m_profile")
        } else if (rolesfind === 'User' || this.web_role === 'User') {
            this.props.history.push("/user_profile")
        }
    }

    render() {

        return (
            <div>
                <div className="outerLay" id="outerlay"></div>
                <div className="sidemenu" id="sidemenu">
                    <div className="profile-header">
                        <a href="#">
                            <figure>{
                                this.state.image_url ? <img src={this.state.image_url} alt="User" /> : <img src={noimage} alt="User" />
                            }</figure>
                            <figcaption>
                                <strong>{this.state.FirstName}</strong>
                                <span>{this.state.phone}</span>
                            </figcaption>
                        </a>
                    </div>
                    <div className="menu">
                        <ul>
                            <li>  <a href="javascript:void(0)" onClick={this.getUserDetail} className="nav-link"><i className="icon profile-icon"></i>Profile</a></li>
                            <li><NavLink to="/event"><i className="icon events-icon"></i>Events</NavLink></li>
                            <li><NavLink to="/getmentalhealth"><i className="icon mobile-mental-health-icon"></i>MPN Mobile Mental Health Unit</NavLink></li>
                            <li><NavLink to="/mental_health_tips"><i className="icon mental-health-icon"></i>Mental Health Tips</NavLink></li>
                            <li><NavLink to="/contact"><i className="icon contact-icon"></i> Contact Us</NavLink></li>
                            <li><NavLink to="/privacy_policy"><i className="icon contact-icon"></i>Privacy Policy</NavLink></li>
                            <li><a href="#" onClick={this.userlogout}><i className="icon logout-icon"></i> Log Out</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Sidebar)
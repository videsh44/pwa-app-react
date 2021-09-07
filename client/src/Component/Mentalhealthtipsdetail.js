import React from 'react';
import eventBanner from '../assets/images/event-banner.jpg';
import logo from '../assets/images/hemburger-icon.png'
import axios from '../Helper/Instance';
import Loader from '../Component/Loader/Loader'
import { NavLink } from "react-router-dom";
import bell from '../assets/images/bell-icon.png';
import applogo from '../assets/images/logo.png'

import Event_Registration from './Event_Registration'
import Event from '../Component/Event'

class Mentalhealthtipsdetail extends React.Component {
    constructor(props) {
        super(props)
        this.token = localStorage.getItem("token")
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
        }
        this.state = {
            Event_name: "",
            Event_Date: "",
            Event_content: "",
            Event_title: "",
            document_link: "",
            dcoument_url: "",
            load: true,
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
        if (this.props.props && this.props.props.id) {
            let Eventdetail = await axios.get('/ca/v1/getListMentalTipDoc', {
                params: {
                    eventId: this.props.props.id
                },
                headers: config
            })
            if (Eventdetail.data.data[0].hasOwnProperty('post_date') && Eventdetail.data.data[0].post_date) {
                let date = new Date(Eventdetail.data.data[0].post_date);
                var d = (new Date(Eventdetail.data.data[0].post_date) + '').split(' ');
                d[0] = d[0] + ',';
                d[2] = d[2] + ',';
                d = [d[0], d[1], d[2], d[3]].join(' ');
                if (Number.isNaN(date.getMonth())) {
                    let arr = Eventdetail.data.data[0].post_date.split(/[- :]/);
                    date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                    var update_d = (new Date(date) + '').split(' ');
                    update_d[0] = update_d[0] + ',';
                    update_d[2] = update_d[2] + ',';
                    d = [update_d[0], update_d[1], update_d[2], update_d[3]].join(' ');
                }
                this.setState({
                    Event_name: Eventdetail.data.data[0].post_name,
                    Event_Date: d,
                    Event_content: Eventdetail.data.data[0].post_content,
                    Event_title: Eventdetail.data.data[0].post_title,
                    document_link: Eventdetail.data.data[0].document_link,
                    dcoument_url: Eventdetail.data.data[0].dcoument_url,
                    load: false
                })
            }
        }
    }

    prevRoutes = () => {
        this.props.props.func()
    }

    render() {
        console.log(this.state.document_link);
        return (
            <>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                        <div className="flexbox">
                            <div className="links">
                                <a href="#!" onClick={this.prevRoutes}><i className="angle-left"></i>Back</a>
                            </div>
                            <a href="#" className="applogo"><img src={applogo} height="40px" alt="" /></a>

                        </div>
                    </div>
                </div>
                {
                    this.state.load ? <Loader /> : <div className="main-section mid-con">
                        <div className="event-banner">
                        </div>
                        <div className="event-description">
                            <div className="container-fluid">
                                <div className="event-header">
                                    <div className="name">
                                        <strong>Title</strong>
                                        {this.state.Event_name}
                                    </div>
                                    <div className="name date">
                                        <strong>Date</strong>
                                        {this.state.Event_Date}
                                    </div>
                                </div>
                                <div className="content">
                                    <h3>{this.state.Event_title}</h3>
                                    <p dangerouslySetInnerHTML={{ __html: this.state.Event_content }}></p>
                                </div>
                                {/* <div className="view-document">
                                    <strong>View Document: </strong>
                                    <a href={this.state.dcoument_url}>View Document</a>
                                </div> */}
                                <div className="view-document">
                                    <strong>Source Link : </strong>
                                    <a href={this.state.document_link}>{this.state.document_link}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default Mentalhealthtipsdetail;
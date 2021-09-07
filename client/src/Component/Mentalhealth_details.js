import React from 'react';
import eventBanner from '../assets/images/event-banner.jpg';
import logo from '../assets/images/hemburger-icon.png'
import axios from '../Helper/Instance';
import Loader from '../Component/Loader/Loader'
import Event from '../Component/Event'
import { NavLink } from "react-router-dom";
import applogo from '../assets/images/logo.png'

import bell from '../assets/images/bell-icon.png';

class Event_details extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            MentalEvent_location: "",
            MentalEvent_Date: "",
            MentalEvent_content: "",
            MentalEvent_title: "",
            load: true,
        }
    }
    async componentDidMount() {

        if (this.props.props && this.props.props.id) {
            let MentalEventdetail = await axios.get('/ca/v1/getMobileMentalHealthEventList', {
                params: {
                    eventId: this.props.props.id
                }
            })
            if (MentalEventdetail.data.data[0].hasOwnProperty('time') && MentalEventdetail.data.data[0].time) {
                let date = new Date(MentalEventdetail.data.data[0].time);
                var d = (new Date(MentalEventdetail.data.data[0].time) + '').split(' ');
                d[0] = d[0] + ',';
                d[2] = d[2] + ',';
                d = [d[0], d[1], d[2], d[3]].join(' ');
                if (Number.isNaN(date.getMonth())) {
                    let arr = MentalEventdetail.data.data[0].time.split(/[- :]/);
                    date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                    var update_d = (new Date(date) + '').split(' ');
                    update_d[0] = update_d[0] + ',';
                    update_d[2] = update_d[2] + ',';
                    d = [update_d[0], update_d[1], update_d[2], update_d[3]].join(' ');
                }
                this.setState({
                    MentalEvent_location: MentalEventdetail.data.data[0].location,
                    MentalEvent_Date: d,
                    MentalEvent_content: MentalEventdetail.data.data[0].post_content,
                    MentalEvent_title: MentalEventdetail.data.data[0].post_title,
                    load: false
                })
            }
        }
    }

    prevRoutes = () => {
        this.props.props.func()
    }

    render() {
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
                                        {this.state.MentalEvent_title}
                                    </div>
                                    <div className="name date">
                                        <strong><i className="fa fa-map-marker" aria-hidden="true"></i> Location</strong>
                                        {this.state.MentalEvent_location}
                                    </div>
                                </div>

                                <div className="time">
                                    <strong>Time</strong> {this.state.MentalEvent_Date}
                                </div>

                                <div className="content">
                                    <h3>{this.state.Event_title}</h3>
                                    <p dangerouslySetInnerHTML={{ __html: this.state.MentalEvent_content }}></p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default Event_details;
import React from 'react';
import eventBanner from '../assets/images/event-banner.jpg';
import logo from '../assets/images/hemburger-icon.png'
import axios from '../Helper/Instance'
import Loader from '../Component/Loader/Loader'
import applogo from '../assets/images/logo.png'
import { NavLink } from "react-router-dom";
import bell from '../assets/images/bell-icon.png';
import Event_Registration from './Event_Registration'
import Event from '../Component/Event'
class Event_details extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Event_name: "",
            Event_Date: "",
            Event_content: "",
            Event_title: "",
            load: true,
        }
    }

    async componentDidMount() {

        if (this.props.props && this.props.props.id) {
            let Eventdetail = await axios.get('/ca/v1/getEventList', {
                params: {
                    eventId: this.props.props.id
                }
            })
            if (Eventdetail.data.data[0].hasOwnProperty('_event_start_date') && Eventdetail.data.data[0]._event_start_date) {
                let date = new Date(Eventdetail.data.data[0]._event_start);
                var d = (new Date(Eventdetail.data.data[0]._event_start_date) + '').split(' ');
                d[0] = d[0] + ',';
                d[2] = d[2] + ',';
                d = [d[0], d[1], d[2], d[3]].join(' ');
                if (Number.isNaN(date.getMonth())) {
                    let arr = Eventdetail.data.data[0]._event_start.split(/[- :]/);
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
                            {/* <figure>
                                <img src={eventBanner} alt="" />
                            </figure> */}
                        </div>
                        <div className="event-description">
                            <div className="container-fluid">
                                <div className="event-header">
                                    <div className="name">
                                        <strong>Event Name</strong>
                                        {this.state.Event_name}
                                    </div>
                                    <div className="name date">
                                        <strong>Event Date</strong>
                                        {this.state.Event_Date}
                                    </div>
                                </div>
                                <div className="content">
                                    <h3>{this.state.Event_title}</h3>
                                    <p dangerouslySetInnerHTML={{ __html: this.state.Event_content }}></p>
                                </div>
                                {
                                    this.props && (
                                        this.props.props && <Event_Registration
                                            Event_detail={{
                                                Event_id: this.props.props.id,
                                                currentPage: this.props.props.currentPage,
                                                updatefunc: this.props.props.updatefunc,
                                                isRegistered: this.props.props.isRegistered,
                                                update_user: this.props.props.upd_Register
                                            }}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default Event_details;
import React, { Component } from 'react'
import axios from '../Helper/Instance';
import { NavLink, withRouter } from "react-router-dom";
import bell from '../assets/images/bell-icon.png';
import Pagination from 'react-responsive-pagination';
import Loader from '../Component/Loader/Loader'
import applogo from '../assets/images/logo.png'
import moment from 'moment'
import { Unreadnotification } from '../Helper/ProfileApi'
import Notification_detail from './Notification_detail'
class Notification extends Component {
    constructor(props) {
        super(props)
        let findtoken = localStorage.getItem("role")
        let webtoken = localStorage.getItem("webtoken")
        let webrole = localStorage.getItem("webrole")
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
        }
        this.state = {
            findtoken,
            webtoken,
            webrole,
            content: [],
            Loading: true,
            total_post: [],
            postperpage: 5,
            currentPage: 1,
            unread: "",
            route: false,
            totalpostnumber: "",
            loadingpage: false,
            index: "",
            route: false
        }
    }

    prevRoute = async () => {
        let gettoken = localStorage.getItem("token")
        let getrole = localStorage.getItem("role")
        if (getrole === "subscriber") {
            if (gettoken !== null) {
                this.props.history.push(`/m_profile`)
            }
        } else if (this.state.webtoken !== null) {
            if (this.state.webrole === "subscriber") {
                this.props.history.push(`/m_profile?token=${this.state.webtoken}&roletype=${this.state.webrole}`)
            } else {
                this.props.history.push(`/home_page/?token=${this.state.webtoken}&roletype=${this.state.webrole}`)
            }
        }
        else if (getrole === "User") {
            var config = {};
            if (gettoken !== null) {
                var config = {
                    "Authorization": `Bearer ${gettoken}`
                }
            } else if (this.state.webtoken !== null) {
                var config = {
                    "Authorization": `Bearer ${this.state.webtoken}`
                }
            }
            if (gettoken !== null) {
                let tokenfind = await axios.get('/ca/v1/getProfile',
                    {
                        headers: config
                    })
                if (this.state.findtoken === "User" && gettoken) {
                    this.props.history.push(`/home_page/${tokenfind.data.data.user_data.data.display_name}`)
                }
            }
        }
    }

    waytoEvent = () => {
        this.props.history.push("/event")
    }


    viewDetail = (id) => {
        this.setState({
            route: true,
            index: id
        })
    }

    async componentDidMount() {
        let unread_message = await Unreadnotification()
        if (unread_message !== undefined) {
            let total_count = unread_message.Event_obj
            await this.setState({
                unread: total_count
            })
        }
        setInterval(async () => {
            let unread_message = await Unreadnotification()
            if (unread_message !== undefined) {
                let total_count = unread_message.Event_obj
                await this.setState({
                    unread: total_count
                })
            }
        }, 30000);
        this.receivedData(this.state.currentPage)
        let _token = localStorage.getItem("token")
        var config = {};
        if (_token !== null) {
            var config = {
                "Authorization": `Bearer ${_token}`
            }
        } else if (this.state.webtoken !== null) {
            var config = {
                "Authorization": `Bearer ${this.state.webtoken}`
            }
        }
        if (_token != null || this.state.webtoken != null) {
            try {
                let updatenotify = await axios.post('/ca/v1/updateAnnouncementStatus', null,
                    {
                        headers: config
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
    }

    receivedData = (page) => {
        let Get_token = localStorage.getItem("token")
        var config = {};
        if (Get_token !== null) {
            var config = {
                "Authorization": `Bearer ${Get_token}`
            }
        } else if (this.state.webtoken !== null) {
            var config = {
                "Authorization": `Bearer ${this.state.webtoken}`
            }
        }
        if (Get_token != null || this.state.webtoken != null) {
            axios.get('/ca/v1/getAnnouncementList', {
                params: {
                    page: page,
                    per_page: 10
                },
                headers: config
            }).then((res) => {
                let totallength = res.data.total_pages
                this.setState({
                    total_post: res.data.data,
                    Loading: false,
                    totalpostnumber: totallength,
                    content: res.data.data,
                    currentPage: page,
                    loadingpage: true
                })
            }).catch((e) => {
                console.log(e.message)
            })
        }
    }

    changeroute = () => {
        this.setState({ route: false })
    }

    render() {
        const { content } = this.state
        content.map((val, ind) => {
            if (val.hasOwnProperty('post_content') && val.post_content) {
                let str = val.post_content
                if (str.length > 200) {
                    val.post_content = str.substring(0, 200) + "....";
                } else {
                    val.post_content = str;
                }
            }
            if (val.hasOwnProperty('post_date') && val.post_date) {
                // var old_date = (new Date(val.post_date))
                // var current_date = new Date()
                // const milliseconds = Math.abs(current_date.getTime() - old_date.getTime());
                // const hours = milliseconds / 36e5
                // val.time = Math.floor(hours)
                // console.log(val.time)

                //format('ddd,MMM D,YYYY')
                // var now = moment();
                var end = moment(val.post_date).format('ddd, MMM D, YYYY')
                // var duration = moment.duration(now.diff(end))
                // console.log(duration.asDays())
                // var hours = Math.floor(duration.asHours());
                val.time = end;
            }
            return val;
        })
        let totalpage = Math.ceil(this.state.totalpostnumber / this.state.postperpage)
        return (
            <div>
                {
                    this.state.route ? <Notification_detail props={{ id: this.state.index, func: this.changeroute }} /> :
                        <div>
                            <div className="login-signup-header fixed">
                                <div className="container-fluid">
                                    <div className="flexbox">
                                        <div className="links">
                                            <a href="javascript:void(0)" onClick={this.prevRoute}><i className="angle-left"></i>Notifications</a>
                                        </div>
                                        <a href="#" className="applogo"><img src={applogo} height="40px" alt="" /></a>
                                        <div className="bell">
                                            <NavLink to="/notification" ><img src={bell} alt="Bell" /></NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <section className="main-section">
                                <div className="content-section">
                                    <div className="container-fluid">
                                        <div className="notification-block">
                                            {
                                                console.log(this.state.unread)
                                            }
                                            <ul>
                                                {
                                                    this.state.Loading ? <Loader /> : (
                                                        this.state.unread !== 0 &&
                                                        <li onClick={this.waytoEvent}>
                                                            {
                                                                this.state.unread === 1 ? <div>
                                                                    <h4> {this.state.unread} New Event Created By Admin </h4>
                                                                    <p>Please click here to show in detail</p>
                                                                </div> : <div>
                                                                    <h4> {this.state.unread} New Events Created By Admin</h4>
                                                                    <p>Please click here to show in detail</p>
                                                                </div>
                                                            }


                                                        </li>
                                                    )
                                                }
                                                {
                                                    this.state.Loading ? <Loader /> : this.state.total_post.map((val, ind) => (
                                                        <li key={ind} onClick={() => { this.viewDetail(val.ID) }}>
                                                            <h4>{val.post_title}</h4>
                                                            <p>{val.post_content}</p>
                                                            <p className="time">{val.time}</p>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                        {
                                            this.state.loadingpage && (
                                                this.state.total_post != "" && <Pagination
                                                    current={this.state.currentPage}
                                                    total={totalpage}
                                                    onPageChange={(page) => { this.receivedData(page) }}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            </section>
                        </div>
                }
            </div>
        )
    }
}

export default withRouter(Notification)


import React, { Component } from 'react'
import logo from '../assets/images/hemburger-icon.png'
import axios from '../Helper/Instance';
import '../Component/script.js'
import sidemenu from '../Helper/Sidemenu'
import Sidebar from '../Component/Sidebar'
import Pagination from 'react-responsive-pagination';
import Loader from '../Component/Loader/Loader'
import Event_details from './Event_details'
import applogo from '../assets/images/logo.png'

import { NavLink } from "react-router-dom";
import bell from '../assets/images/bell-icon.png';
import Mentalhealth_details from './Mentalhealth_details'
import { isIOSDevice } from '../Helper/Device_detect'
export default class MentalhealthEventList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: [],
            Loading: true,
            total_post: [],
            postperpage: 5,
            currentPage: 1,
            totalpostnumber: "",
            loadingpage: false,
            index: "",
            route: false
        }
    }

    componentDidMount() {
        sidemenu()
        this.receivedData(this.state.currentPage)
    }

    receivedData = (page) => {
        axios.get('/ca/v1/getMobileMentalHealthEventList', {
            params: {
                page: page,
                per_page: this.state.postperpage
            }
        }).then((res) => {
            let totallength = res.data.total
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

    viewDetail = (id) => {
        this.setState({
            route: true,
            index: id,
        })
    }

    changeroute = () => {
        this.setState({
            route: false
        })
    }
    render() {
        sidemenu()
        const { content } = this.state
        content.map((val, ind) => {
            let date = new Date(val.time);
            if (val.hasOwnProperty('post_content') && val.post_content) {
                let str = val.post_content
                if (str.length > 200) {
                    val.post_content = str.substring(0, 200) + "<span style='color:#DAA520;'>...Read more</span>";
                } else {
                    val.post_content = str;
                }
            }
            if (val.hasOwnProperty('time') && val.time) {
                var d = (new Date(val.time) + '').split(' ');
                d[0] = d[0] + ',';
                d[2] = d[2] + ',';
                val.times = [d[0], d[1], d[2], d[3]].join(' ');
            }
            if (Number.isNaN(date.getMonth())) {
                let arr = val.time.split(/[- :]/);
                date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                var update_d = (new Date(date) + '').split(' ');
                update_d[0] = update_d[0] + ',';
                update_d[2] = update_d[2] + ',';
                val.times = [update_d[0], update_d[1], update_d[2], update_d[3]].join(' ');
            }
            return val;
        })
        let totalpage = Math.ceil(this.state.totalpostnumber / this.state.postperpage)
        return (
            <div>
                {
                    this.state.route ? <Mentalhealth_details props={{ id: this.state.index, func: this.changeroute }} /> : <div>
                        <Sidebar />
                        <div className="header">
                            <div className="container-fluid">
                                <div className="inner-con search-doctor">
                                    <div className="hemburger-menu">
                                        {
                                            !isIOSDevice() && <a href="#" id="menuBtn"><img src={logo} alt="Hemburger" /></a>
                                        }
                                        <span>MPN Mobile Mental Health Unit</span>
                                    </div>
                                    <a href="#"><img src={applogo} height="40px" alt="" /></a>

                                </div>
                            </div>
                        </div>

                        <section className="main-section">
                            <div className="content-section upcoming-events">
                                <div className="container-fluid">
                                    <h2>MPN Mobile Mental Health Unit</h2>
                                    <div className="expert-category-list">
                                        <ul>
                                            {
                                                this.state.Loading ? <Loader /> : this.state.total_post.map((val, ind) => (
                                                    <li key={ind} onClick={() => { this.viewDetail(val.ID) }}>
                                                        <div className="caption">
                                                            <h3>{val.post_title}</h3>
                                                            <h4>{val.location}</h4>
                                                            <h4>{val.times}</h4>
                                                            <div dangerouslySetInnerHTML={{ __html: val.post_content }}></div>
                                                        </div>
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
                        </section> </div>
                }
            </div>
        )
    }
}

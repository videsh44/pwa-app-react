import React, { Component, useState } from 'react'
import logo from '../assets/images/hemburger-icon.png'
import axios from '../Helper/Instance';
import '../Component/script.js'
import sidemenu from '../Helper/Sidemenu'
import Sidebar from '../Component/Sidebar'
import Pagination from 'react-responsive-pagination';
import Loader from '../Component/Loader/Loader'
import Mentalhealthtipsdetail from './Mentalhealthtipsdetail'
import { NavLink } from "react-router-dom";
import applogo from '../assets/images/logo.png'

import bell from '../assets/images/bell-icon.png';
import { isIOSDevice } from '../Helper/Device_detect'

export default class Mentalhealthtips extends Component {
    constructor(props) {
        super(props)
        this.token = localStorage.getItem("token")
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
        }
        this.state = {
            content: [],
            Loading: true,
            total_post: [],
            postperpage: 5,
            currentPage: 1,
            totalpostnumber: "",
            loadingpage: false,
            index: "",
            route: false,
            FirstName: "",
            LastName: "",
            Email: "",
            phone: "",
            errors: {}

        }
    }

    componentDidMount() {
        sidemenu()
        this.receivedData(this.state.currentPage)
    }

    receivedData = (page) => {
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
        axios.get('/ca/v1/getListMentalTipDoc', {
            params: {
                page: page,
                per_page: this.state.postperpage
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

    viewDetail = (id, register) => {
        this.setState({
            route: true,
            index: id
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
            let date = new Date(val.post_date);
            if (val.hasOwnProperty('post_content') && val.post_content) {
                let str = val.post_content
                if (str.length > 200) {
                    val.post_content = str.substring(0, 200) + "....";
                } else {
                    val.post_content = str;
                }
            }
            if (val.hasOwnProperty('post_date') && val.post_date) {
                var d = (new Date(val.post_date) + '').split(' ');
                d[0] = d[0] + ',';
                d[2] = d[2] + ',';
                val.post_dates = [d[0], d[1], d[2], d[3]].join(' ');
            }
            if (Number.isNaN(date.getMonth())) {
                let arr = val.post_date.split(/[- :]/);
                date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                var update_d = (new Date(date) + '').split(' ');
                update_d[0] = update_d[0] + ',';
                update_d[2] = update_d[2] + ',';
                val.post_dates = [update_d[0], update_d[1], update_d[2], update_d[3]].join(' ');
            }
            return val;
        })
        let totalpage = Math.ceil(this.state.totalpostnumber / this.state.postperpage)
        return (
            <div>
                {
                    this.state.route ? <Mentalhealthtipsdetail props={{
                        id: this.state.index, func: this.changeroute, currentPage: this.state.currentPage,
                        updatefunc: this.receivedData
                    }} /> : <div>
                        <Sidebar />
                        <div className="header">
                            <div className="container-fluid">
                                <div className="inner-con search-doctor">
                                    <div className="hemburger-menu">
                                        {
                                            !isIOSDevice() && <a href="#" id="menuBtn"><img src={logo} alt="Hemburger" /></a>
                                        }
                                        <span>Mental Health Tips</span>

                                    </div>
                                    <a href="#"><img src={applogo} height="40px" alt="" /></a>

                                </div>
                            </div>
                        </div>

                        <section className="main-section">
                            <div className="content-section upcoming-events">
                                <div className="container-fluid">
                                    <h2>Mental Health Tips</h2>
                                    <div className="expert-category-list">
                                        <ul>
                                            {
                                                this.state.Loading ? <Loader /> : this.state.total_post.map((val, ind) => (
                                                    <li key={ind}>
                                                        <div className="caption" onClick={() => { this.viewDetail(val.ID) }}>
                                                            <h3>{val.post_title}</h3>
                                                            <h4>{val.post_dates}</h4>
                                                            <p dangerouslySetInnerHTML={{ __html: val.post_content }}></p>
                                                        </div>
                                                        <div className="health-links">
                                                            {/* <a href={val.dcoument_url}>View Document</a><br /> */}
                                                            <a href={val.document_link}>Source Link : {val.document_link}</a>
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
                        </section>
                    </div>
                }
            </div>
        )
    }
}



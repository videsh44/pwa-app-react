import React, { Component } from 'react'
import axios from '../../Helper/Instance'
import expert_img from '../../assets/images/expert-img1.png'
import { toast } from 'react-toastify'
import $ from 'jquery'
import Home_page from '../Home_page'
import View_doctor from '../Member/View_doctor'
import logo from '../../assets/images/verified-user.png'
import Example from '../Member/pop_up'
import Pagination from 'react-responsive-pagination';
import { NavLink } from "react-router-dom";
import bell from '../../assets/images/bell-icon.png';
import applogo from '../../assets/images/logo.png'
import noimage from '../../assets/images/download.png'
import { Unreadnotification } from '../../Helper/ProfileApi'
import Loader from '../Loader/Loader'
const WAIT_INTERVAL = 2000
const ENTER_KEY = 13
export default class Search_doctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category_m: [],
            items: [],
            categorylist: [],
            total_post: [],
            postperpage: 5,
            unread: "",
            currentPage: 1,
            totalpostnumber: "",
            category: "Searchcategory",
            Search: "",
            catval: "",
            loading: true,
            index: 0,
            loadingpage: false,
            count: 0,
            arrayVal: [],
            docindex: "",
            online: true,
            isdoctor: false,
            route: false
        }
        this.token = localStorage.getItem('token')
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
        }
        this.timer = null
    }


    handleChange = e => {
        clearTimeout(this.timer)
        this.setState({ Search: e.target.value })
        this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL)
    }

    handleKeyDown = e => {
        if (e.keyCode === ENTER_KEY) {
            clearTimeout(this.timer)
            this.triggerChange()
        }
    }

    triggerChange = () => {
        const { Search } = this.state
        if (Search.trim() != "") {
            this.setState({
                category: "Searchlist",
                search: Search
            }, () => {
                this.receivedData(this.state.currentPage)
            })
        } else if (this.state.arrayVal != "") {
            this.setState({
                category: "Searchcategory",
                arrayVal: this.state.arrayVal
            }, () => {
                this.receivedData(this.state.currentPage)
            })
        }
    }

    onToggle(index) {
        let newItems = this.state.category_m
        let newArray = [];
        newItems[index].checked = !newItems[index].checked
        newItems.forEach((val) => {
            if (val.checked) {
                newArray.push(val.value);
            }
        })
        this.setState({
            arrayVal: newArray
        })
        this.setState({
            category_m: newItems,
            count: ++this.state.count,
            category: "Searchcategory"
        }, () => {
            this.receivedData(this.state.currentPage)
        })
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
        this.getAllCategories()
        if (this.state.arrayVal.length > 0) {
            this.receivedData(this.state.currentPage)
        }
    }

    getAllCategories = async () => {
        try {
            let category = await axios.get('/ca/v1/getCategoryList')
            let data = category.data.data
            data.forEach(function (element) {
                element.checked = false
            });
            this.setState({
                category_m: data.reverse(),
                items: data
            })
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            }
        }
    }

    componentDidUpdate(prevprops, prevstate) {
        if (this.state.count === 0) {
            if (this.props && this.props.categoryvalue) {
                let propsVal = this.props.categoryvalue.category
                this.state.index = this.state.category_m.findIndex(p => p.label === propsVal.label)
                if (this.state.index === -1) {
                    return this.state.category_m
                } else {
                    $(`#${this.state.index}`).prop('checked', true);
                    this.state.category_m[this.state.index].checked = true
                    this.state.arrayVal = []
                    this.state.arrayVal.push(this.state.category_m[this.state.index].value)
                    this.receivedData(this.state.currentPage)
                }
                this.state.count = ++this.state.count
            } else {
            }
        }
    }

    receivedData = async (page) => {
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
        if (this.state.category === "Searchlist") {
            try {
                this.setState({ loading: true })
                let All_data = await axios.post("/ca/v1/getMemberDetails", null, {
                    params: {
                        search: this.state.search,
                        page: page,
                        per_page: this.state.postperpage
                    }, headers: config
                })
                let Raw_data_search = All_data.data.data
                await this.setState({
                    totalpostnumber: All_data.data.total_users,
                    total_post: Raw_data_search,
                    currentPage: 1,
                    loading: false,
                    loadingpage: true
                })
            } catch (error) {
                if (!error.response) {
                    this.setState({
                        loading: false,
                        loadingpage: true
                    })
                } else {
                    toast.error(error.response.data.message)
                }
            }
        } else if (this.state.category === "Searchcategory") {
            try {
                this.setState({ loading: true })
                let All_data = await axios.post("/ca/v1/getMemberDetails", null, {
                    params: {
                        category: this.state.arrayVal,
                        page: page,
                        per_page: this.state.postperpage
                    },
                    headers: config
                })
                let Raw_data_search = All_data.data.data
                localStorage.setItem("searchoffline", JSON.stringify(Raw_data_search))
                localStorage.setItem("searchtotalpost", All_data.data.total_users)
                await this.setState({
                    totalpostnumber: All_data.data.total_users,
                    total_post: Raw_data_search,
                    currentPage: page,
                    loading: false,
                    loadingpage: true
                })
            } catch (error) {
                if (!error.response) {
                    let Searchofflinedata = JSON.parse(localStorage.getItem('searchoffline'))
                    let Searchpostnumber = localStorage.getItem("searchtotalpost")
                    this.setState({
                        totalpostnumber: Searchpostnumber,
                        total_post: Searchofflinedata,
                        currentPage: 1,
                        loading: false,
                        loadingpage: true
                    })
                }
                else {
                    toast.error(error.response.data.message)
                }
            }

        }

    }

    addallfilter = () => {
        let newItems = this.state.category_m
        let newArray = [];
        newItems.forEach((val, index) => {
            this.state.category_m[index].checked = true
            newArray.push(this.state.category_m[index].value)
        })
        this.setState({
            arrayVal: newArray
        })
        this.setState({
            category_m: newItems,
            category: "Searchcategory"
        }, () => {
            this.receivedData(this.state.currentPage)
        })
    }

    Backpage = () => {
        this.props.categoryvalue.func()
    }

    viewDoctor = (id) => {
        this.setState({
            docindex: id,
            isdoctor: true,
        })
    }

    removetocategory = () => {
        this.setState({
            isdoctor: false
        })
    }

    getVal = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { category_m, total_post } = this.state
        let totalpage = Math.ceil(this.state.totalpostnumber / this.state.postperpage)

        return (
            <div>
                {
                    this.state.isdoctor ? <View_doctor Id={{ index: this.state.docindex, newfunc: this.removetocategory }} /> : <div>
                        <div className="header">
                            <div className="container-fluid">
                                <div className="inner-con search-doctor">
                                    <div className="links">
                                        <a href='#!' onClick={this.Backpage}><i className="angle-left"></i>Back</a>
                                    </div>
                                    <a href="#" className="applogo"><img src={applogo} height="40px" alt="" /></a>
                                    <div className="bell">
                                        <NavLink to="/notification" ><img src={bell} alt="Bell" /><sup className="badge">{this.state.unread !== 0 && this.state.unread}</sup></NavLink>
                                    </div>
                                    {/* <div className="explore">
                                        Explore<span>Plus</span>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <section className="main-section">
                            <div className="filter-section">
                                <div className="container-fluid">
                                    <div className="form">
                                        <input type="text" className="searchInput" value={this.state.Search} onChange={this.handleChange} onKeyDown={this.handleKeyDown} placeholder="Psychiatric" />
                                    </div>
                                    <div className="filter-block">
                                        <ul>
                                            {
                                                category_m && category_m.map((val, index) => (
                                                    <li key={index}>
                                                        <label className="checkbox-label">
                                                            <input type="checkbox" id={index} checked={val.checked} onChange={(e) => { this.onToggle(e.target.id) }} />
                                                            <span className="checkbox-custom"></span>
                                                        </label>
                                                        {val.label}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                        <div className="all-filter-btn">
                                            <a href="#!" className="btn btn-small-outline" onClick={this.addallfilter}>All Filters</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="content-section doctor-section">
                                <div>
                                    {
                                        this.state.online ? this.state.loading ? <Loader /> : <div className="doctor-list">
                                            <ul>
                                                {
                                                    this.state.total_post != "" ? this.state.total_post.map((val, index) => (
                                                        <li key={index}>
                                                            <div className="list-header">
                                                                <div className="left">
                                                                    <figure>{val.image_url != "" ? <img src={val.image_url} alt={val.category_name} /> : <img src={noimage} alt="any name" />}</figure>
                                                                    <div className="caption">
                                                                        <h3>{val.user_other_info.first_name[0]} {val.user_other_info.last_name[0]}</h3>
                                                                        <h4>
                                                                            {
                                                                                Array.isArray(val.category_name.data) ? (val.category_name.data != "" ? val.category_name.data.map((value, ind) => (
                                                                                    value.label === "Other" ? val.user_other_info.custom_category[0] : (ind == 0 ? <span key={ind}>{value.label}</span> :
                                                                                        <span key={ind}>, {value.label}</span>)
                                                                                )) : "Not Defined") : "Not Defined"
                                                                            }
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <div className="right">
                                                                    <a href="#!" className="btn btn-small-outline"><img src={logo} alt="Verified User" /> Verified</a>
                                                                </div>
                                                            </div>
                                                            <div className="content-block">
                                                                <h4 className="heading"><strong>About Mental Health Professionals</strong> </h4>
                                                                <p>{(val.user_other_info.hasOwnProperty('member_about_des') ?
                                                                    (val.user_other_info.member_about_des[0] != "" ? val.user_other_info.member_about_des[0] : "Update youself") : "Please update your profile")
                                                                }</p>
                                                                <h3>
                                                                    <strong>Specialties :</strong>
                                                                    {
                                                                        Array.isArray(val.category_name.data) ? (val.category_name.data != "" ? val.category_name.data.map((value, ind) => (
                                                                            value.label === "Other" ? <span>{val.user_other_info.custom_category[0]}</span> : (ind == 0 ? <span key={ind}>{value.label}</span> :
                                                                                <span key={ind}>, {value.label}</span>)
                                                                        )) : "Not Defined") : "Not Defined"
                                                                    }
                                                                </h3>
                                                                <div className="cost">Cost per Session: <span style={{ color: "black" }}> &#36; {(val.user_other_info.hasOwnProperty('finance_cost_per_session') ?
                                                                    (val.user_other_info.finance_cost_per_session[0] != "" ? val.user_other_info.finance_cost_per_session[0] : "Please update your profile") : "Please update your profile")
                                                                }</span></div>
                                                            </div>
                                                            <div className="list-footer">
                                                                <button type="button" className="btn btn-outline-primary" onClick={() => { this.viewDoctor(val.user_data.ID) }}>VIEW PROFESSONIAL</button>
                                                                <Example number={{ contact: val.user_other_info.dbem_phone[0], unique: this.state.postperpage }} />
                                                            </div>
                                                        </li>

                                                    )) : <div>Data not found....</div>
                                                }
                                            </ul>
                                        </div> : <div>Data Not Found......</div>
                                    }
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

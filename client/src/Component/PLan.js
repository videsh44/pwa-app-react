import React, { Component } from 'react'
import sidemenu from '../Helper/Sidemenu'
import Sidebar from '../Component/Sidebar'
import hemburger from '../assets/images/hemburger-icon.png'
import Payment from '../Component/Member/Payment'
import { Redirect } from 'react-router-dom'
import axios from '../Helper/Instance';

export default class PLan extends Component {
    constructor(props) {
        super(props)
        let params = (new URL(document.location)).searchParams
        if (params.has('token') && params.has('roletype')) {
            this.web_token = params.get('token')
            this.web_role = params.get('roletype')
        }
        this.state = {
            payment: false,
            plan: [],
            reverseback: false,
            paymentback: false,
            payment_detail: {}
        }

    }

    async componentDidMount() {
        sidemenu()
        try {
            let getrole = localStorage.getItem("role")
            if (getrole === "User") {
                if (this.props.location.state && this.props.location.state.credential && this.props.location.state.Address_detail) {
                    console.log("ugwiisw")
                } else if (this.props.location.state && this.props.location.state.Address_detail && this.props.location.state.pass && this.props.location.state.personal) {
                    console.log("again return to the same")
                } else if (this.props.location.state && this.props.location.state.pass && this.props.location.state.personal) {
                    console.log(this.props)
                } else if (this.props.location.state && this.props.location.state.Address_detail) {
                    console.log(this.props)
                }
                else {
                    this.props.history.push('/signup')
                }

            } else if (getrole === "subscriber") {
                console.log(this.props)
                if (this.props.location.state && this.props.location.state.credential) {
                }
                else if (this.props.location.state && this.props.location.state.personal && this.props.location.state.pass) {

                }
                else {
                    this.props.history.push('/member_signup')
                }
            }
            let tarrifplan = await axios.get('/ca/v1/getPlanList')
            this.setState({
                plan: tarrifplan.data.data
            })
        } catch (error) {
            console.log(error)
        }
    }

    paymentinfo = (paymentinfo) => {
        console.log(this.props)
        this.setState({
            payment: true,
            payment_detail: paymentinfo
        })
    }

    goBackpage = () => {
        let getrole = localStorage.getItem("role")
        if (getrole === "subscriber") {
            this.setState({
                reverseback: true
            })
        } else if (getrole === "User") {
            this.setState({
                paymentback: true
            })

        }
    }

    render() {
        const { plan } = this.state
        if (this.state.payment && this.props.location.state && this.props.location.state.credential && this.props.location.state.Address_detail) {
            return <Payment credential={{
                personal: this.props.location.state.credential,
                billing_address: this.props.location.state.Address_detail,
                payment_option: this.state.payment_detail
            }} />
        } else if (this.state.payment && this.props.location.state && this.props.location.state.personal && this.props.location.state.Address_detail && this.props.location.state.pass) {
            return <Payment credential={{
                personal: this.props.location.state.personal,
                billing_address: this.props.location.state.Address_detail,
                payment_option: this.state.payment_detail
            }} />
        } else if (this.state.payment && this.props.location.state && this.props.location.state.credential) {
            return <Payment credential={{
                personal: this.props.location.state.credential,
                payment_option: this.state.payment_detail
            }} />
        } else if (this.state.payment && this.props.location.state && this.props.location.state.personal && this.props.location.state.pass) {
            return <Payment credential={{
                personal: this.props.location.state.personal,
                payment_option: this.state.payment_detail,
                password: this.props.location.state.pass
            }} />
        } else if (this.state.payment && this.props.location.state && this.props.location.state.personal && this.props.location.state.Address_detail) {
            return <Payment credential={{
                personal: this.props.location.state.personal,
                billing_address: this.props.location.state.Address_detail,
                payment_option: this.state.payment_detail
            }} />
        }

        if (this.state.reverseback) {
            return <Redirect to={{
                pathname: '/member_signup',
                state: {
                    pass: this.props.location.state.pass,
                    personal: this.props.location.state.personal,
                    userId: this.props.location.state.userId,
                    payment_option: this.state.payment_detail,
                }
            }} />
        }
        if (this.state.paymentback || this.state.paymentback && this.props.location.state.credential && this.props.location.state.Address_detail) {
            return <Redirect to={{
                pathname: '/user_location',
                state: {
                    pass: this.props.location.state.pass,
                    personal: this.props.location.state.personal,
                    credential: this.props.location.state.credential,
                    billing_address: this.props.location.state.Address_detail,
                }
            }} />
        }
        if (this.props.location.state === undefined) {
            let findrole = localStorage.getItem("role")
            if (findrole === "User" || this.web_role === "User") {
                return <Redirect to={`/signup`} />
            } else if (findrole === "subscriber" || this.web_role === "subscriber") {
                return <Redirect to={`/member_signup`} />
            } else {
                return <Redirect to={`/loginhome`} />
            }
        }
        return (
            <div>
                {/* <Sidebar /> */}
                <div className="header">
                    <div className="container-fluid">
                        <div className="inner-con search-doctor">
                            <div className="links">
                                <a onClick={this.goBackpage}><i className="angle-left" ></i>Plan</a>
                            </div>
                            <div className="explore">
                                Explore<span>Plus</span>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="main-section">
                    <div className="content-section plans">
                        <div className="container-fluid">
                            <h4 className="normal-title">Everyone Receives <strong>2 month Professional free sign up.</strong></h4>
                            <div className="plan-list">
                                <ul>
                                    {
                                        plan != "" && plan.map((val, index) => (
                                            index === 0 ?
                                                <li key={index}>
                                                    <div dangerouslySetInnerHTML={{ __html: val.content }} >
                                                    </div>
                                                    <button type="button" className="btn btn-outline-primary btn-small" onClick={() => { this.paymentinfo(val) }}>Subscribe</button>
                                                </li> : (index === 1 ?
                                                    <li className="premium" key={index}>
                                                        <div dangerouslySetInnerHTML={{ __html: val.content }} >
                                                        </div>
                                                        <button type="button" className="btn btn-primary btn-small select-btn" onClick={() => { this.paymentinfo(val) }}>Subscribe</button>
                                                    </li> :
                                                    <li className="silver" key={index}>
                                                        <div dangerouslySetInnerHTML={{ __html: val.content }} >
                                                        </div>
                                                        <button type="button" className="btn btn-outline-primary btn-small" onClick={() => { this.paymentinfo(val) }}>Subscribe</button>
                                                    </li>)
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

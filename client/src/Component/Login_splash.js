import React, { Component } from 'react'
import splashimage from '../assets/images/logo.png';
import { Redirect } from 'react-router-dom'
import './script'
export default class Login_splash extends Component {
    constructor(props) {
        super(props)
        let findtoken = localStorage.getItem("token")
        this.state = {
            findtoken,
            nickname: ""
        }
    }

    movetowardsignup = () => {
        setTimeout(() => {
            this.props.history.push('/loginhome')
        }, 1500)
    }

    render() {
        return (
            <div>
                <section className="main-container" >
                    <div className="container-fluid center-block">
                        <div className="logo">
                            <img src={splashimage} id="net" onLoad={this.movetowardsignup} />
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

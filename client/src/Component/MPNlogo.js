import React, { Component } from 'react'
import logo from '../assets/images/logo.png'

export default class MPNlogo extends Component {
    render() {
        return (
            <div>
                <div className="mpn-logo"><img src={logo} alt="login" /></div>
            </div>
        )
    }
}

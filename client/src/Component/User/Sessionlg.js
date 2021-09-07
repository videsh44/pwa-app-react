import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
export default class Signup extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        localStorage.clear()
        localStorage.removeItem('token')
        if ('caches' in window) {
            caches.keys().then((names) => {
                names.forEach(name => {
                    caches.delete(name);
                })
            });
        }
        this.props.history.push('/loginhome')
    }
    render() {
        return (
            <div> </div>
        )
    }
}
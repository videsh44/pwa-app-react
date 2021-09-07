import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoutes = ({ component: Component, ...rest }) => {
    var session_token = localStorage.getItem('token')
    var getrole = localStorage.getItem('role')
    let params = (new URL(document.location)).searchParams
    if (params.has('token') && params.has('roletype')) {
        var web_token = params.get('token')
        var web_role = params.get("roletype")
    }
    return (
        <Route {...rest} render={props => (
            (session_token !== null && getrole === "User" || web_token !== null && web_role === "User") ? (
                < Component  {...props} />
            ) : (
                <Redirect to={{
                    pathname: '/loginhome',
                }}
                />
            )
        )}
        />
    )
};


export default PrivateRoutes;
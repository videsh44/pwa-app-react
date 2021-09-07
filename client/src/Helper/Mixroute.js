import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const Mixroute = ({ component: Component, ...rest }) => {
    var session_token1 = localStorage.getItem('token')
    let params = (new URL(document.location)).searchParams
    if (params.has('token')) {
        var web_token = params.get('token')
    }
    return (
        <Route {...rest} render={props => (
            session_token1 !== null || web_token !== null ? (
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


export default Mixroute;
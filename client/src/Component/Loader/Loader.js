import React from 'react';
import loaderimg from '../../assets/images/loader.gif';

class Loader extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="loaderDiv">
                <div className="loader">Loading...</div>
            </div>
        ) 
    }
}

export default Loader;
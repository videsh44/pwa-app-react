import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import inputPlaceHolders from '../../Helper/Form_control'
export default class  User_billing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Mental_health_role: "",
            License_number: "",
            License_state: "",
            License_expiration: "",
            Card_number: "",
            Expiry_date: "",
            Security_code: "",
            Name_on_card: "",
            Billing_address: "",
            errors: {}
        }

    }
    saveAndContinue = (e) => {
        e.preventDefault();

    }

    handleChange = () => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount() {
        inputPlaceHolders()
    }

    render() {

        return (
            <div>
                <div className="login-signup-header fixed">
                    <div className="container-fluid">
                    </div>
                </div>
                <form onSubmit={this.saveAndContinue}>
                    <section className="main-container mid-con">
                        <div className="container-fluid">
                            <div className="content login">
                                <div className="welcome mg-top-0">
                                    <strong>Billing Info</strong>
                                </div>
                                <div className="form-block formBox">
                                    <fieldset className="selectInput">
                                        <span className="placeholder">Mental Health Role</span>
                                        <select className="form-control input__field" name='Mental_health_role' value={this.state.Mental_health_role} onChange={this.handleChange}>
                                            <option value="">Counselor</option>
                                        </select>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">License Number </span>
                                        <input type="text" name="License_number" value={this.state.License_number} className="form-control input__field" onChange={this.handleChange} autoComplete="off" />
                                    </fieldset>
                                    <fieldset className="selectInput">
                                        <span className="placeholder">License State</span>
                                        <select onChange={this.props.handleChange} className="form-control input__field" name="License_state" value={this.state.License_state}>
                                            <option value="">License State</option>
                                        </select>
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">License Expiration </span>
                                        <input type="password" name="License_expiration" onChange={this.handleChange} className="form-control input__field" autoComplete="off" value={this.state.License_expiration} />
                                    </fieldset>
                                    <h3 className="left">Billing Info</h3>
                                    <fieldset>
                                        <span className="placeholder">Card Number</span>
                                        <input type="text" name="Card_number" onChange={this.handleChange} value={this.state.Card_number} className="form-control input__field" autoComplete="off" />
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Expiry Date</span>
                                        <input type="text" name="Expiry_date" value={this.state.Expiry_date} onChange={this.handleChange} className="form-control input__field" autoComplete="off" />
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Security Code</span>
                                        <input type="text" name="Security_code" onChange={this.handleChange} value={this.state.Security_code} className="form-control input__field" autoComplete="off" />
                                    </fieldset>
                                    <fieldset>
                                        <span className="placeholder">Name on Card</span>
                                        <input type="text" value={this.state.Name_on_card} name="Name_on_card" onChange={this.handleChange} className="form-control input__field" autoComplete="off" />
                                    </fieldset>

                                    <div className="radio-block">
                                        <ul>
                                            <li>
                                                <label className="checkbox-label">
                                                    <input type="radio" onChange={this.handleChange} name="Billing_address" />
                                                    <span className="checkbox-custom"></span>
                                                </label>
                                                <strong>Billing Address</strong>
                                                <p>The BLVD at Medical Center Apartments 4980 USAA Blvd San
                                        Antonio, TX 78240, San Antonio, 78240</p>
                                            </li>
                                            <li>
                                                <label className="checkbox-label">
                                                    <input type="radio" onChange={this.handleChange} name="Billing_address" />
                                                    <span className="checkbox-custom"></span>
                                                </label>
                                                <p>Use Different Address</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="bottom-footer">
                        <div className="container-fluid">
                            <div className="button-block">
                                <button type="submit" className="btn btn-primary">Make Payment</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

import React, { Component } from 'react'
import { isfirstname, ValidFirstname, isLastname, ValidLastname, isEmail, validateEmail, iscontact, validatecontact } from '../Validation/signup'
import inputPlaceHolders from '../Helper/Form_control'
import Loader from '../Component/Loader/Loader'
import { Button, Modal } from 'react-bootstrap'
import axios from '../Helper/Instance';
export default class Event_Registration extends Component {
    constructor(props) {
        super(props)
        this.token = localStorage.getItem("token")
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
        }
        this.state = {
            FirstName: "",
            LastName: "",
            Email: "",
            phone: "",
            show: false,
            load: false,
            errors: {}
        }
    }

    handleClose = () => {
        this.setState({
            show: false
        })
    }


    handleShow = () => {
        this.setState({
            show: true
        })
    }

    async componentDidMount() {
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
        if (this.token !== null) {
            try {
                let update_registration = await axios.get('/ca/v1/getProfile', {
                    headers: config
                })
                let { first_name, last_name, dbem_phone, nickname } = update_registration.data.data.user_other_info
                this.setState({
                    FirstName: first_name[0],
                    LastName: last_name[0],
                    Email: nickname[0],
                    phone: dbem_phone[0]
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    validateRegisterParam = () => {
        let errors = {};
        if (isfirstname(this.state)) errors.Firstname = 'Please enter you Firstname'
        else if (!ValidFirstname(this.state)) errors.Firstname = 'Name should be Char.';
        if (isLastname(this.state)) errors.Lastname = 'Please enter you Lastname';
        else if (!ValidLastname(this.state)) errors.Lastname = 'Name should be Char.';
        if (isEmail(this.state)) errors.Email = 'Please enter email.';
        else if (!validateEmail(this.state)) errors.Email = 'Please enter valid email.';
        if (iscontact(this.state)) errors.phone = "Please enter phone number"
        else if (!validatecontact(this.state)) errors.phone = "Please enter correct phone number"
        if (this.state.errors === "") { this.setState({ errors }) }
        return errors;
    }

    register = async (e) => {
        e.preventDefault();
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
        const errors = this.validateRegisterParam();
        if (Object.keys(errors).length !== 0) {
            this.setState({ errors });
            return false;
        }
        if (this.props && this.props.Event_detail) {
            let Register_obj = {
                first_name: this.state.FirstName,
                last_name: this.state.LastName,
                email_address: this.state.Email,
                phone_number: this.state.phone,
                event_id: this.props.Event_detail.Event_id
            }
            try {
                this.setState({ load: true })
                let Registered_user = await axios.post("/ca/v1/registerForEvent/", Register_obj,
                    {
                        headers: config
                    })
                if ('caches' in window) {
                    caches.keys().then((names) => {
                        names.forEach(name => {
                            caches.delete(name);
                        })
                    });
                }
                this.props.Event_detail.updatefunc(this.props.Event_detail.currentPage)
                await setTimeout(() => {
                    this.props.Event_detail.updatefunc(this.props.Event_detail.currentPage)
                    this.handleClose()
                    this.setState({ load: false })
                }, 2000)

            } catch (error) {
                console.log(error)
            }
        }
    }

    getValue = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        setTimeout(() => {
            inputPlaceHolders()
        }, 0);
        if (this.state.load) {
            return <Loader />
        }
        return (
            <div>
                {
                    this.props.Event_detail && (
                        this.props.Event_detail.isRegistered === 0 ? <div className="reg-btn"><Button variant="primary" onClick={this.handleShow}>
                            Registration
                        </Button></div> : <div className="reg-btn"><Button disabled onClick={this.handleShow}>
                            Successful Registered
                        </Button></div>
                    )
                }
                <Modal show={this.state.show} onHide={this.handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registration</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.register}>
                            <div className="form-block formBox">
                                <fieldset>
                                    <span className="placeholder">First Name </span>
                                    <input type="text" name="FirstName" className="form-control input__field" value={this.state.FirstName} onChange={this.getValue} autoComplete="off" />
                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Firstname}</label>
                                </fieldset>
                                <fieldset>
                                    <span className="placeholder">Last Name </span>
                                    <input type="text" name="LastName" value={this.state.LastName} onChange={this.getValue} className="form-control input__field" autoComplete="off" />
                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Lastname}</label>
                                </fieldset>
                                <fieldset>
                                    <span className="placeholder">Email</span>
                                    <input type="text" name="Email" value={this.state.Email} onChange={this.getValue} className="form-control input__field" autoComplete="off" />
                                    <label className="error" style={{ display: "block" }}>{this.state.errors.Email}</label>
                                </fieldset>
                                <fieldset>
                                    <span className="placeholder">Phone</span>
                                    <input type="number" value={this.state.phone} onChange={this.getValue} name="phone" className="form-control input__field" autoComplete="off" />
                                    <label className="error" style={{ display: "block" }}>{this.state.errors.phone}</label>
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

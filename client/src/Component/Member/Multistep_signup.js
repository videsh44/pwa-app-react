import React, { Component } from 'react';
import Msignup from '../Member/Msignup'
import Msignup_location from '../Member/Msignup_location'
import Msignup_billing from './Msignup_billing'
import { toast } from 'react-toastify'
import axios from '../../Helper/Instance'
import { Redirect } from 'react-router-dom'
class MainForm extends Component {
    constructor(props) {
        super(props)
        let findtoken = localStorage.getItem("role")
        let params = (new URL(document.location)).searchParams
        if (params.has('token')) {
            this.web_token = params.get('token')
            this.web_role = params.get("roletype")

        }
        this.state = {
            step: 1,
            u_id: "",
            user_id: "",
            Account: "Member",
            FirstName: "",
            LastName: "",
            Email: "",
            Password: "",
            Country: "",
            Gender: "",
            title: "",
            FirstName: "",
            LastName: "",
            custom_category:"",
            phone: "",
            address: "",
            street_address: "",
            address_line_2: "",
            city: "",
            State: "",
            zip_code: "",
            isChecked: false,
            Mental_health_role: "",
            License_number: "",
            License_state: "",
            License_expiration: "",
            Card_number: "",
            Expiry_date: "",
            Security_code: "",
            Name_on_card: "",
            Billing_address: "0",
            custom_address: "",
            findtoken,
            startDate: new Date(),
            selectedValue: [],
            allvaluefromcategory: [],
            address1: "",
            street_address1: "",
            address_line_21: "",
            city1: "",
            State1: "",
            zip_code1: "",
            Country1: "",
            errors: {}
        }
    }


    nextStep = () => {
        const { step } = this.state
        this.setState({
            step: step + 1
        })
    }

    prevStep = () => {
        const { step } = this.state
        this.setState({
            step: step - 1
        })
    }

    handleChange = event => {
        if (['checkbox'].includes(event.target.type)) {
            this.state.isChecked = !this.state.isChecked
            this.setState({
                isChecked: this.state.isChecked
            });
        }
        this.setState({ [event.target.name]: event.target.value })
    }

    handleChange1 = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    selectoption = e => {
        this.setState({
            selectedValue: Array.isArray(e) ? e.map(x => x.value) : [],
            allvaluefromcategory: Array.isArray(e) ? e.map(x => x) : []
        })
    };

    selectCountry = (val) => {
        this.setState({ Country: val })
    }

    selectCountry1 = (val) => {
        this.setState({ Country1: val })
    }

    async componentDidMount() {
        let getId = localStorage.getItem("User_id")
        let token = localStorage.getItem('token')
        var config = {};
        if (token !== null) {
            var config = {
                "Authorization": `Bearer ${token}`
            }
        } else if (this.web_token !== undefined) {
            var config = {
                "Authorization": `Bearer ${this.web_token}`
            }
        }
        if (this.props.location && this.props.location.state && this.props.location.state.userId && this.props.location.state.pass && this.props.location.state.personal) {
            try {

                let docval = await axios.get('/ca/v1/users', {
                    params: {
                        user_id: this.props.location.state.userId
                    }
                })
                if ('caches' in window) {
                    caches.keys().then((names) => {
                        names.forEach(name => {
                            caches.delete(name);
                        })
                    });
                }
                console.log(docval.data.data)
                if (docval.data.data.user_other_info.hasOwnProperty('billing_address_type') && docval.data.data.user_other_info.License_expiration[0]) {
                    this.setState({
                        step: 3,
                        FirstName: docval.data.data.user_other_info.first_name[0],
                        LastName: docval.data.data.user_other_info.last_name[0],
                        Email: docval.data.data.user_other_info.nickname[0],
                        Gender: docval.data.data.user_other_info.gender[0],
                        title: docval.data.data.user_other_info.user_title[0],
                        phone: docval.data.data.user_other_info.dbem_phone[0],
                        address: docval.data.data.user_other_info.user_address[0],
                        street_address: docval.data.data.user_other_info.street_address[0],
                        address_line_2: docval.data.data.user_other_info.address_line2[0],
                        Country: docval.data.data.user_other_info.user_country[0],
                        city: docval.data.data.user_other_info.user_city[0],
                        Password: this.props.location.state.pass,
                        user_id: this.props.location.state.userId,
                        State: docval.data.data.user_other_info.user_state[0],
                        zip_code: docval.data.data.user_other_info.user_zip_code[0],
                        allvaluefromcategory: docval.data.data.category_name.data,
                        selectedValue: docval.data.data.user_other_info.category_id,
                        Mental_health_role: docval.data.data.user_other_info.Mental_health_role[0],
                        License_number: docval.data.data.user_other_info.License_number[0],
                        License_state: docval.data.data.user_other_info.License_state[0],
                        address1: docval.data.data.user_other_info.billing_address[0],
                        street_address1: docval.data.data.user_other_info.billing_street_address[0],
                        address_line_21: docval.data.data.user_other_info.billing_address_line2[0],
                        city1: docval.data.data.user_other_info.billing_city[0],
                        State1: docval.data.data.user_other_info.billing_state[0],
                        zip_code1: docval.data.data.user_other_info.billing_zip_code[0],
                        Country1: docval.data.data.user_other_info.billing_country[0],
                        Billing_address: docval.data.data.user_other_info.billing_address_type[0],
                        startDate: new Date(docval.data.data.user_other_info.License_expiration[0]),
                    })
                } else {
                    console.log(docval.data.data.user_other_info)
                    this.setState({
                        step: 3,
                        FirstName: docval.data.data.user_other_info.first_name[0],
                        LastName: docval.data.data.user_other_info.last_name[0],
                        Email: docval.data.data.user_other_info.nickname[0],
                        Gender: docval.data.data.user_other_info.gender[0],
                        title: docval.data.data.user_other_info.user_title[0],
                        phone: docval.data.data.user_other_info.dbem_phone[0],
                        address: docval.data.data.user_other_info.user_address[0],
                        street_address: docval.data.data.user_other_info.street_address[0],
                        address_line_2: docval.data.data.user_other_info.address_line2[0],
                        Country: docval.data.data.user_other_info.user_country[0],
                        city: docval.data.data.user_other_info.user_city[0],
                        Password: this.props.location.state.pass,
                        user_id: this.props.location.state.userId,
                        State: docval.data.data.user_other_info.user_state[0],
                        zip_code: docval.data.data.user_other_info.user_zip_code[0],
                        allvaluefromcategory: docval.data.data.category_name.data,
                        selectedValue: docval.data.data.user_other_info.category_id,
                    })
                }


            } catch (error) {
                console.log(error)
            }
        } else if (token != null && this.state.findtoken === "User") {
            if (token != null) {
                let tokenfind = await axios.get('/ca/v1/getProfile',
                    {
                        headers: config
                    })

                if (this.state.findtoken === "User" && token) {
                    this.props.history.push(`/home_page/${tokenfind.data.data.user_data.data.display_name}`)
                }
            }
        } else if (typeof getId !== 'undefined' && getId && this.state.findtoken === "subscriber") {
            let password = localStorage.getItem("password")
            try {

                let docval = await axios.get('/ca/v1/users', {
                    params: {
                        user_id: getId
                    }
                })
                console.log(docval.data.data)
                if ('caches' in window) {
                    caches.keys().then((names) => {
                        names.forEach(name => {
                            caches.delete(name);
                        })
                    });
                }
                if (docval.data.data.user_other_info.hasOwnProperty('billing_address_type') && docval.data.data.user_other_info.License_expiration[0]) {
                    this.setState({
                        step: 3,
                        FirstName: docval.data.data.user_other_info.first_name[0],
                        LastName: docval.data.data.user_other_info.last_name[0],
                        Email: docval.data.data.user_other_info.nickname[0],
                        Gender: docval.data.data.user_other_info.gender[0],
                        title: docval.data.data.user_other_info.user_title[0],
                        phone: docval.data.data.user_other_info.dbem_phone[0],
                        address: docval.data.data.user_other_info.user_address[0],
                        street_address: docval.data.data.user_other_info.street_address[0],
                        address_line_2: docval.data.data.user_other_info.address_line2[0],
                        Country: docval.data.data.user_other_info.user_country[0],
                        city: docval.data.data.user_other_info.user_city[0],
                        Password: password,
                        State: docval.data.data.user_other_info.user_state[0],
                        zip_code: docval.data.data.user_other_info.user_zip_code[0],
                        allvaluefromcategory: docval.data.data.category_name.data,
                        selectedValue: docval.data.data.user_other_info.category_id,
                        Mental_health_role: docval.data.data.user_other_info.Mental_health_role[0],
                        License_number: docval.data.data.user_other_info.License_number[0],
                        License_state: docval.data.data.user_other_info.License_state[0],
                        address1: docval.data.data.user_other_info.billing_address[0],
                        street_address1: docval.data.data.user_other_info.billing_street_address[0],
                        address_line_21: docval.data.data.user_other_info.billing_address_line2[0],
                        city1: docval.data.data.user_other_info.billing_city[0],
                        State1: docval.data.data.user_other_info.billing_state[0],
                        zip_code1: docval.data.data.user_other_info.billing_zip_code[0],
                        Country1: docval.data.data.user_other_info.billing_country[0],
                        Billing_address: docval.data.data.user_other_info.billing_address_type[0],
                        startDate: new Date(docval.data.data.user_other_info.License_expiration[0]),
                    })
                } else {
                    this.setState({
                        step: 1,
                        FirstName: docval.data.data.user_other_info.first_name[0],
                        LastName: docval.data.data.user_other_info.last_name[0],
                        Email: docval.data.data.user_other_info.nickname[0],
                        Gender: docval.data.data.user_other_info.gender[0],
                        title: docval.data.data.user_other_info.user_title[0],
                        phone: docval.data.data.user_other_info.dbem_phone[0],
                        address: docval.data.data.user_other_info.user_address[0],
                        street_address: docval.data.data.user_other_info.street_address[0],
                        address_line_2: docval.data.data.user_other_info.address_line2[0],
                        Country: docval.data.data.user_other_info.user_country[0],
                        city: docval.data.data.user_other_info.user_city[0],
                        Password: password,
                        State: docval.data.data.user_other_info.user_state[0],
                        zip_code: docval.data.data.user_other_info.user_zip_code[0],
                        allvaluefromcategory: docval.data.data.category_name.data,
                        selectedValue: docval.data.data.user_other_info.category_id,
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    Datechange = (e) => {
        this.setState({
            startDate: e
        })
    }

    render() {
        let token = localStorage.getItem("token")
        if (token != null && this.state.findtoken === "subscriber" || this.web_token !== undefined && this.web_role === "subscriber") {
            return <Redirect to={"/m_profile"} />
        }
        const { step } = this.state;
        switch (step) {
            case 1:
                return <Msignup
                    nextStep={this.nextStep}
                    handleChange={this.handleChange}
                    values={this.state}
                />
            case 2:
                return <Msignup_location
                    nextStep={this.nextStep}
                    prevStep={this.prevStep}
                    handleChange={this.handleChange}
                    changecountry={this.selectCountry}
                    changeoption={this.selectoption}
                    values={this.state}
                />
            case 3:
                return <Msignup_billing
                    prevStep={this.prevStep}
                    handleChange1={this.handleChange1}
                    handleChange={this.handleChange}
                    Datechange={this.Datechange}
                    changecountry1={this.selectCountry1}
                    values={this.state}
                />
        }
    }
}

export default MainForm;

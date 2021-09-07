import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { withRouter, useHistory } from 'react-router-dom';
import Apis from '../../Helper/Apis'
import axios from 'axios'
import Loader from '../Loader/Loader'
import { toast } from 'react-toastify'
import qs from 'qs'
import {
    CardElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Redirect } from 'react-router-dom';
const SubscribeForm = (props) => {
    let history = useHistory();
    const secret_key = "sk_test_51ITnpCGsV3ExWL3qZtysOvhWQExdteldgCTQhRaj95dZlnA44qddLEBzeiIxNQR4br8Hcb2UyWvcqPUMgyJvkW2L00sl93Bxvw"
    const [messages, _setMessages] = useState('');
    const [subscription, setSubscription] = useState();
    const [username, changeusername] = useState("")
    const [FirstName, changeFirstName] = useState("")
    const [password, changepassword] = useState("")
    const [Lastname, changeLastname] = useState("")
    const [Email, changeEmail] = useState("")
    const [loader, changeloader] = useState(false)
    const [Country, changeCountry] = useState("")
    const [state, changestate] = useState("")
    const [address, changeaddress] = useState("")
    const [city, changecity] = useState("")
    const [address_line2, changeaddressline_2] = useState("")
    const [street, changestreet] = useState("")
    const [zip, changezip] = useState("")

    const setMessage = (message) => {
        _setMessages(`${message}`);
    }

    useEffect(() => {
        if (props.location.state && props.location.state.Address_detail && props.location.state.credential && props.credential.payment_option) {
            changeusername(props.location.state.credential.Email)
            changepassword(props.location.state.credential.Password)
            changeLastname(props.location.state.credential.LastName)
            changeFirstName(props.location.state.credential.FirstName)
            changeEmail(props.location.state.credential.Email)
            changeaddress(props.location.state.Address_detail.address)
            changeCountry(props.location.state.Address_detail.Country)
            changestate(props.location.state.Address_detail.State)
            changeaddressline_2(props.location.state.Address_detail.address_line_2)
            changezip(props.location.state.Address_detail.zip_code)
            changecity(props.location.state.Address_detail.city)
            changestreet(props.location.state.Address_detail.street_address)
        } else if (props.location.state && props.location.state.Address_detail && props.location.state.pass && props.location.state.personal && props.credential.payment_option) {
            console.log(props.location.state)
            changeusername(props.location.state.personal.user_other_info.nickname[0])
            changepassword(props.location.state.pass)
            changeLastname(props.location.state.personal.user_other_info.last_name[0])
            changeFirstName(props.location.state.personal.user_other_info.first_name[0])
            changeEmail(props.location.state.personal.user_data.data.user_email)
            changeCountry(props.location.state.Address_detail.Country)
            changestate(props.location.state.Address_detail.State)
            changezip(props.location.state.Address_detail.zip_code)
            changeaddressline_2(props.location.state.Address_detail.address_line_2)
            changecity(props.location.state.Address_detail.city)
            changestreet(props.location.state.Address_detail.street_address)
        } else if (props.location.state && props.location.state.Address_detail && props.location.state.personal && props.credential.payment_option) {
            console.log(props.location.state)
            changeusername(props.location.state.personal.Email)
            changepassword(props.location.state.personal.Password)
            changeLastname(props.location.state.personal.LastName)
            changeFirstName(props.location.state.personal.FirstName)
            changeEmail(props.location.state.personal.Email)
            changeCountry(props.location.state.Address_detail.Country)
            changestate(props.location.state.Address_detail.State)
            changezip(props.location.state.Address_detail.zip_code)
            changeaddressline_2(props.location.state.Address_detail.address_line_2)
            changecity(props.location.state.Address_detail.city)
            changestreet(props.location.state.Address_detail.street_address)
        }
        else if (props.location.state && props.location.state.credential && props.credential.payment_option) {
            console.log(props.location.state)
            changeusername(props.location.state.credential.Email)
            changepassword(props.location.state.credential.Password)
            changeLastname(props.location.state.credential.LastName)
            changeFirstName(props.location.state.credential.FirstName)
            changeEmail(props.location.state.credential.Email)
            changeCountry(props.location.state.credential.Country)
            changestate(props.location.state.credential.State)
            changeaddressline_2(props.location.state.address_line_2)
            changezip(props.location.state.credential.zip_code)
            changecity(props.location.state.credential.city)
            changestreet(props.location.state.credential.street_address)
        } else if (props.location.state && props.location.state.personal && props.location.state.pass && props.credential.payment_option) {
            changeusername(props.location.state.personal.user_other_info.nickname[0])
            changepassword(props.location.state.pass)
            changeLastname(props.location.state.personal.user_other_info.last_name[0])
            changeFirstName(props.location.state.personal.user_other_info.first_name[0])
            changeEmail(props.location.state.personal.user_data.data.user_email)
            changeCountry(props.location.state.personal.user_other_info.user_country[0])
            changeaddressline_2(props.location.state.personal.user_other_info.address_line2[0])
            changestate(props.location.state.personal.user_other_info.user_state[0])
            changezip(props.location.state.personal.user_other_info.user_zip_code[0])
            changecity(props.location.state.personal.user_other_info.user_city[0])
            changestreet(props.location.state.personal.user_other_info.street_address[0])
        }
        else {
            let findroles = localStorage.getItem("role")
            if (findroles === "User") {
                return history.push("/signup")
            } else if (findroles === "subscriber") {
                return history.push("/member_signup")
            }
        }
    }, [])

    // Initialize an instance of stripe.
    const stripe = useStripe();
    const elements = useElements();
    if (!stripe || !elements) {
        return '';
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const cardElement = elements.getElement(CardElement);
        let { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: FirstName,
                email: Email,
                address: street,
            }
        });
        if (error) {
            setMessage("")
            setMessage(error.message);
            return;
        }
        console.log(paymentMethod)
        setMessage(`Payment method created ${paymentMethod.id}`);
        changeloader(true)
        try {
            let address_content = {
                line1: street,
                postal_code: zip,
                city: city,
                state: state,
                country: Country
            }
            let create_customer = await axios({
                method: 'post',
                url: 'https://api.stripe.com/v1/customers',
                data: qs.stringify({
                    email: Email,
                    payment_method: paymentMethod.id,
                    name: FirstName,
                    description: "Testing purpose",
                    address: address_content
                }),
                headers: {
                    "Authorization": `Bearer ${secret_key}`,
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })
            if (create_customer.data.id !== "") {
                if (props.credential.payment_option && props.credential.payment_option.product_key) {
                    let create_subscription = await axios({
                        method: 'post',
                        url: 'https://api.stripe.com/v1/subscriptions',
                        data: qs.stringify({
                            customer: create_customer.data.id,
                            items: {
                                "0": {
                                    "price": props.credential.payment_option.product_key
                                }
                            },
                            trial_period_days: "1",
                            off_session: "true",
                            enable_incomplete_payments: "false",
                            collection_method: "charge_automatically"
                        }),
                        headers: {
                            "Authorization": `Bearer ${secret_key}`,
                            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                        }
                    })
                    if (create_subscription.data.id !== "" && create_subscription.data.plan.active) {
                        let userlogin = await axios.post(Apis.Userlogin, {
                            username: username,
                            password: password
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                        toast.success("Signup Successfully")
                        localStorage.removeItem("token")
                        localStorage.setItem("token", userlogin.data.token)
                        let getroles = localStorage.getItem("role")
                        if (getroles === "User") {
                            history.push(`/home_page/${FirstName + "%20" + Lastname}`);
                        } else if (getroles === "subscriber") {
                            history.push('/m_profile')
                        }
                    }
                }
            }

        } catch (error) {
            console.log(error)
        }
    }
    if (loader) {
        return <Loader />
    }
    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <div className="error-msg">{messages}</div>
            <button type="submit">
                Subscribe
      </button>
        </form>
    )
}
const Payment = (props) => {
    let stripePromise = null;
    const [publishableKey, setPublishableKey] = useState("pk_test_51ITnpCGsV3ExWL3qztch05dZuvBBAwE4JLscWVvKxMv0RvJuYpqQnGNig99QheuLprqs6noro9ypj9SgGI1CR9hT00DwPhhNXg");

    if (publishableKey) {
        stripePromise = loadStripe(publishableKey);
    }
    return (
        <div>
            <div className="header">
                <div className="container-fluid">
                    <div className="inner-con search-doctor">
                        <div className="links">
                            <a ><i></i>Payment</a>
                        </div>
                        <div className="explore">
                            Explore<span>Plus</span>
                        </div>
                    </div>
                </div>
            </div>
            <section className="main-section">
                <div className="container-fluid">
                    <div className="cart-section">
                        <Elements stripe={stripePromise}>
                            <SubscribeForm {...props} />
                        </Elements>
                    </div>
                </div>
            </section>
        </div>

    );
}
export default withRouter(Payment);
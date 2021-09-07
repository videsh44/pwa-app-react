import { Button, Modal } from 'react-bootstrap'
import React, { Component, useState } from 'react'
import GoogleMapReact from 'google-map-react';
import Geocode from "react-geocode";
const AnyReactComponent = ({ text }) => (
    <div></div>
);

function Address({ address }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Address
        </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Simple todos={address} />
                </Modal.Body>
            </Modal>
        </>
    );
}

class Simple extends Component {
    constructor(props) {
        super(props)
        this.marker = null
        this.state = {
            center: { lat: 59.95, lng: 30.33 },
            zoom: 11,
            map: "",
            place: ""
        }
    }


    componentDidUpdate(prevprops, prevstates) {
        if (prevstates.place != prevprops.todos) {
            if (this.props && this.props.todos) {
                Geocode.fromAddress(this.props.todos, "AIzaSyAi8NfcCvGwRH5BtvM4VVluJxockiwyz0I").then(
                    (response) => {
                        const { lat, lng } = response.results[0].geometry.location;
                        this.setState({
                            center: { lat: lat, lng: lng },
                        }, () => {
                            const contentString = this.props.todos
                            const infowindow = new window.google.maps.InfoWindow({
                                content: contentString,
                            });
                            this.marker = new window.google.maps.Marker({
                                position: this.state.center,
                                title: this.props.todos
                            });
                            this.marker.addListener("click", () => {
                                infowindow.open(this.state.map, this.marker);
                            });
                            this.marker.setMap(this.state.map);
                        })
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            }
            this.setState({
                place: prevprops.todos
            })
        }
    }


    handleApiLoaded = (map, maps) => {
        this.setState({
            map: map
        })
        this.marker = new window.google.maps.Marker({
            position: this.state.center,
            title: this.props.todos
        });
        this.marker.setMap(map);
    };
    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyAi8NfcCvGwRH5BtvM4VVluJxockiwyz0I" }}
                    defaultCenter={this.state.center}
                    center={this.state.center}
                    defaultZoom={this.state.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}>
                    <AnyReactComponent
                        lat={59.955413}
                        lng={30.337844}
                        text={'Kreyser Avrora'}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}
export default Address;
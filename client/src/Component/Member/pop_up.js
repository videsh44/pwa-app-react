import { Button, Modal } from 'react-bootstrap'
import React, { Component, useState } from 'react'
import contact from '../../assets/images/mobile-icon.png';
function Example({ number }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    let formatPhoneNumber = (str) => {
        let cleaned = ('' + str).replace(/\D/g, '');
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            let intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
        }
        return null;
    }
    let newnumber = formatPhoneNumber(number.contact)
    return (
        <>
            {
                number.unique ? (number ?
                    <Button variant="primary" onClick={handleShow}>
                        <img src={contact} alt="" /> CONTACT PROFESSONIAL
                    </Button>
                    : null) : (number.email ? (number ?
                        <div className="doctor-profile-footer">
                            <Button variant="primary" onClick={handleShow1}>
                                <i className="fa fa-envelope" aria-hidden="true"></i>EMAIL PROFESSONIAL
                            </Button>
                            <Button variant="primary" onClick={handleShow}>
                                <img src={contact} alt="" /> CONTACT PROFESSONIAL
                            </Button> </div> : null) : null)
            }
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Me!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{number.contact != "" ?
                    newnumber
                    : "contact not found"}</Modal.Body>
            </Modal>

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                    <Modal.Title>Email Me!</Modal.Title>
                </Modal.Header>
                <Modal.Body>{number.email != "" ? number.email : "Email not found"}</Modal.Body>
            </Modal>
        </>
    );
}

export default Example;
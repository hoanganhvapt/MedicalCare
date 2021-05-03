import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import HelpIcon from "@material-ui/icons/Help";
import ContactsIcon from "@material-ui/icons/Contacts";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import GoogleMapReact from "google-map-react";
function Pricing() {
    const AnyReactComponent = ({ text }) => <div>{text}</div>;
    const [values, setValues] = useState({
        center: {
            lat: 21.003679809783385,
            lng: 105.8490962441493,
        },
        zoom: 15,
    });
    return (
        <div className="pricing__section">
            <div className="pricing__wrapper">
                <h2 className="pricing__heading">Contact Us</h2>
                <h4>Have any questions? We’d love to hear from you.</h4>
                <div className="pricing__container">
                    <Link to="/sign-up" className="pricing__container-card">
                        <div className="pricing__container-cardInfo">
                            <div className="icon">
                                <ContactsIcon
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </div>
                            <h3>Press</h3>
                            <p>
                                Are you interested in our latest news or working
                                on a Grammarly story and need to get in touch?
                            </p>
                        </div>
                    </Link>
                    <Link to="/sign-up" className="pricing__container-card">
                        <div
                            className="pricing__container-cardInfo"
                            style={{ color: "white" }}
                        >
                            <div className="icon">
                                <HelpIcon
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        color: "#000000",
                                    }}
                                />
                            </div>
                            <h3>Help & Support</h3>
                            <p>
                                Our support team is spread across the globe to
                                give you answers fast.
                            </p>
                        </div>
                    </Link>
                    <Link to="/sign-up" className="pricing__container-card">
                        <div className="pricing__container-cardInfo">
                            <div className="icon">
                                <AttachMoneyIcon
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </div>
                            <h3>Sale</h3>
                            <p>
                                Get in touch with our sales team to see how we
                                can work together.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className="contact_map">
                <div className="contact_map-left">
                    <h4>Email : medical.care.789@gmail.com</h4>
                    <h4>Phone : 0936506675 / Fax : 100056789</h4>
                    <h4>54 Lê Thanh Nghị, Bách Khoa, Hai Bà Trưng, Hà Nội </h4>
                </div>
            </div>
            <div style={{ height: "50vh", width: "100%" }}>
                <GoogleMapReact
                    bootstrapURLKeys={{
                        key: "AIzaSyCttzRJ5JxGwM2ckS0YfnKUofJHdnO45zs",
                        //AIzaSyCZQdWZWsNyakL30EbvVherj04c9HcqFc8
                    }}
                    defaultCenter={values.center}
                    defaultZoom={values.zoom}
                >
                    <AnyReactComponent
                        lat={21.003679809783385}
                        lng={105.8490962441493}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>
        </div>
    );
}
export default Pricing;

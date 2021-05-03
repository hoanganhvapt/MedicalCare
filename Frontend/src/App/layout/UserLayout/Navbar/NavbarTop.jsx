import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "react-bootstrap";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import PhoneIcon from "@material-ui/icons/Phone";
const Navbar = (props) => {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener("resize", showButton);

    return (
        <>
            <div className="nav_contact-top">
                <div className="nav_contact-left">
                    <span>54 LÊ THANH NGHỊ, HAI BÀ TRƯNG, HÀ NỘI</span>
                </div>
                <div className="nav_contact-right">
                    <div className="nav_contact-right-email">
                        <MailOutlineIcon style={{ fontSize: "large" }} />
                        <a href="mailto:medical.care.789@gmail.com">
                            <span> MEDICAL.CARE.789@GMAIL.COM </span>
                        </a>
                        |
                    </div>
                    <div className="nav_contact-right-time">
                        <AccessTimeIcon style={{ fontSize: "large" }} />
                        <span> MON - SUN : 8H00 - 18H00 </span>|
                    </div>
                    <div className="nav_contact-right-phone">
                        <PhoneIcon style={{ fontSize: "large" }} />
                        <a href="tel:0936506675">
                            <span> 0936506675 </span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="navbar">
                <div className="navbar-container container">
                    <Link
                        to="/"
                        className="navbar-logo"
                        onClick={closeMobileMenu}
                    >
                        <img
                            src="../../../../../logo_meadical.png"
                            alt="logo"
                            height="55"
                        />
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        {click ? <CloseIcon /> : <MenuIcon />}
                    </div>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <Link
                                to="/"
                                className="nav-links"
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/contact"
                                className="nav-links"
                                onClick={closeMobileMenu}
                            >
                                Contact Us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/feedback"
                                className="nav-links"
                                onClick={closeMobileMenu}
                            >
                                FeedBack
                            </Link>
                        </li>
                        <li className="nav-lang">
                            <a href="#">
                                <img
                                    src="../vi-VN.png"
                                    title="Tiếng Việt (vi)"
                                    alt="Tiếng Việt"
                                    style={{ width: "23px", margin: "10px" }}
                                />
                            </a>
                        </li>
                        <li className="nav-lang">
                            <a href="#">
                                <img
                                    src="../us-UK.png"
                                    title="English (us)"
                                    alt="English"
                                    style={{
                                        width: "23px",
                                        margin: "10px 10px 10px 0 ",
                                    }}
                                />
                            </a>
                        </li>
                        <li className="nav-btn">
                            {button ? (
                                <Link to="/login" className="btn-links">
                                    {/* <Button>SIGN UP</Button> */}
                                    <Button>LOGIN</Button>
                                </Link>
                            ) : (
                                <Link to="/login" className="btn-link">
                                    {/* <Button
                                        buttonStyle="btn--outline"
                                        buttonSize="btn--mobile"
                                        onClick={closeMobileMenu}
                                    >
                                        SIGN UP
                                    </Button> */}
                                    <Button
                                        className="btn-mobile"
                                        onClick={closeMobileMenu}
                                    >
                                        LOGIN
                                    </Button>
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;

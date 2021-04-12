import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "react-bootstrap";

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
                                to="/services"
                                className="nav-links"
                                onClick={closeMobileMenu}
                            >
                                Services
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                to="/products"
                                className="nav-links"
                                onClick={closeMobileMenu}
                            >
                                Products
                            </Link>
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

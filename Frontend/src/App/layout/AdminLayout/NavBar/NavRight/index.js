import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
// import ChatList from "./ChatList";
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";
// import Avatar1 from "../../../../../assets/images/user/avatar-1.jpg";
// import Avatar2 from "../../../../../assets/images/user/avatar-2.jpg";
// import Avatar3 from "../../../../../assets/images/user/avatar-3.jpg";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SignOut } from "../../../../indexSevice";
import { useSelector } from "react-redux";

const NavRight = (props) => {
    // const [listOpen, setListOpen] = useState(false)
    const dataUser = useSelector((state) => state.user.dataUser[0]);
    const logout = () => {
        SignOut()
            .then((res) => window.location.replace("/auth/signin"))
            .catch((err) => console.log(err));
    };
    return (
        <Aux>
            <ul className="navbar-nav ml-auto">
                <li>
                    <Dropdown className="drp-user">
                        <Dropdown.Toggle variant={"link"} id="dropdown-basic">
                            <img
                                src={dataUser?.usr_avatar}
                                className="img-radius mr-2"
                                height="50"
                            />
                            <span>
                                {dataUser?.usr_last_name}{" "}
                                {dataUser?.usr_first_name}
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                            alignRight
                            className="profile-notification"
                        >
                            <div className="pro-head">
                                <img
                                    src={dataUser?.usr_avatar}
                                    className="img-radius"
                                />
                                <span>
                                    {dataUser?.usr_last_name}{" "}
                                    {dataUser?.usr_first_name}
                                </span>
                            </div>
                            <ul className="pro-body">
                                <li>
                                    <a
                                        href={DEMO.BLANK_LINK}
                                        className="dropdown-item"
                                    >
                                        <i className="feather icon-settings" />{" "}
                                        Settings
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={DEMO.BLANK_LINK}
                                        className="dropdown-item"
                                    >
                                        <i className="feather icon-user" />{" "}
                                        Profile
                                    </a>
                                </li>
                                {/* <li>
                                    <a href={DEMO.BLANK_LINK} className="dropdown-item">
                                        <i className="feather icon-mail" /> My Messages
                                    </a>
                                </li> */}
                                <li>
                                    <a
                                        onClick={logout}
                                        className="dropdown-item"
                                    >
                                        <i className="feather icon-log-out" />{" "}
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>

        </Aux>
    );
};

export default NavRight;

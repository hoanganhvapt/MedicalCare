import React from "react";
import DEMO from "./../../../../../store/constant";
import Aux from "../../../../../hoc/_Aux";

const navLogo = (props) => {
    let toggleClass = ["mobile-menu"];
    if (props.collapseMenu) {
        toggleClass = [...toggleClass, "on"];
    }

    return (
        <Aux>
            <div className="navbar-brand header-logo">
                <a href="/" className="b-brand">
                    <img src="/logo.png" className="logo" alt="logo" height="30" />
                    <div className="b-bg">
                        <img src="/logo-mini.png" className="logo-mini" alt="logo" height="28" />
                    </div>
                </a>
                <a
                    href={DEMO.BLANK_LINK}
                    className={toggleClass.join(" ")}
                    id="mobile-collapse"
                    onClick={props.onToggleNavigation}
                >
                    <span />
                </a>
            </div>
        </Aux>
    );
};

export default navLogo;

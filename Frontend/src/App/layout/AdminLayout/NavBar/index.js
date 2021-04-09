import React from "react";
import { connect } from "react-redux";
import NavRight from "./NavRight";
import Aux from "../../../../hoc/_Aux";
import DEMO from "../../../../store/constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collapseNavBar } from "../../../../actions/config";

const NavBar = (props) => {
    let toggleClass = ["mobile-menu"];
    let headerClass = ["navbar", "pcoded-header", "navbar-expand-lg", props.headerBackColor];
    if (props.headerFixedLayout) {
        headerClass = [...headerClass, "headerpos-fixed"];
    }

    if (props.collapseMenu) {
        toggleClass = [...toggleClass, "on"];
    }

    return (
        <Aux>
            <header className={headerClass.join(" ")}>
                <div className="m-header">
                    <a className={toggleClass.join(" ")} id="mobile-collapse1" href={DEMO.BLANK_LINK} onClick={props.onToggleNavigation}>
                        <span />
                    </a>
                    <a href="/" className="b-brand">
                        <img src="/logo.png" alt="logo" height="30" />
                    </a>
                </div>
                <a className="mobile-menu" id="mobile-header" href={DEMO.BLANK_LINK}>
                    <i className="feather icon-more-horizontal" />
                </a>
                <div className="collapse navbar-collapse">
                    <NavRight />
                </div>
            </header>
        </Aux>
    );
};

const mapStateToProps = (state) => {
    return {
        headerBackColor: state.config.headerBackColor,
        headerFixedLayout: state.config.headerFixedLayout,
        collapseMenu: state.config.collapseMenu,
    };
};

const mapDispatchToProps = (dispatch) => collapseNavBar(dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

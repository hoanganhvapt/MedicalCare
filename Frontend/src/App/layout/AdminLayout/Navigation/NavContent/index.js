import React, { useState, forwardRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import windowSize from "react-window-size";
import Aux from "../../../../../hoc/_Aux";
import NavGroup from "./NavGroup";
import DEMO from "../../../../../store/constant";
import { leaveNavContent } from "../../../../../actions/config";

const NavContent = (props, ref) => {
    const [state, setState] = useState({
        scrollWidth: 0,
        prevDisable: true,
        nextDisable: false,
    });

    const scrollPrevHandler = () => {
        const wrapperWidth = document.getElementById("sidenav-wrapper").clientWidth;

        let scrollWidth = state.scrollWidth - wrapperWidth;
        if (scrollWidth < 0) {
            setState({
                ...state,
                scrollWidth: 0,
                prevDisable: true,
                nextDisable: false,
            });
        } else {
            setState({ ...state, scrollWidth: scrollWidth, prevDisable: false });
        }
    };

    const scrollNextHandler = () => {
        const wrapperWidth = document.getElementById("sidenav-wrapper").clientWidth;
        const contentWidth = document.getElementById("sidenav-horizontal").clientWidth;

        let scrollWidth = state.scrollWidth + (wrapperWidth - 80);
        if (scrollWidth > contentWidth - wrapperWidth) {
            scrollWidth = contentWidth - wrapperWidth + 80;
            setState({
                ...state,
                scrollWidth: scrollWidth,
                prevDisable: false,
                nextDisable: true,
            });
        } else {
            setState({ ...state, scrollWidth: scrollWidth, prevDisable: false });
        }
    };

    const navItems = props.navigation.map((item) => {
        if (item.type === "group") return <NavGroup layout={props.layout} key={item.id} group={item} />;
        else return false;
    });

    let mainContent = "";
    if (props.layout === "horizontal") {
        let prevClass = ["sidenav-horizontal-prev"];
        if (state.prevDisable) {
            prevClass = [...prevClass, "disabled"];
        }
        let nextClass = ["sidenav-horizontal-next"];
        if (state.nextDisable) {
            nextClass = [...nextClass, "disabled"];
        }

        mainContent = (
            <div className="navbar-content sidenav-horizontal" id="layout-sidenav">
                <a href={DEMO.BLANK_LINK} className={prevClass.join(" ")} onClick={scrollPrevHandler}>
                    <span />
                </a>
                <div id="sidenav-wrapper" className="sidenav-horizontal-wrapper">
                    <ul
                        id="sidenav-horizontal"
                        className="nav pcoded-inner-navbar sidenav-inner"
                        onMouseLeave={props.onNavContentLeave}
                        style={{
                            marginLeft: "-" + state.scrollWidth + "px",
                        }}
                    >
                        {navItems}
                    </ul>
                </div>
                <a href={DEMO.BLANK_LINK} className={nextClass.join(" ")} onClick={scrollNextHandler}>
                    <span />
                </a>
            </div>
        );
    } else {
        mainContent = (
            <div className="navbar-content datta-scroll">
                <PerfectScrollbar>
                    <ul className="nav pcoded-inner-navbar">{navItems}</ul>
                </PerfectScrollbar>
            </div>
        );
    }

    return <Aux>{mainContent}</Aux>;
};

const mapStateToProps = (state) => {
    return {
        layout: state.config.layout,
        collapseMenu: state.config.collapseMenu,
    };
};

const mapDispatchToProps = (dispatch) => leaveNavContent(dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(windowSize(forwardRef(NavContent))));

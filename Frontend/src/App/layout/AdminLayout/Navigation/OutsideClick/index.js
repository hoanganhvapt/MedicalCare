import React, { useEffect, useRef, forwardRef } from "react";
import { connect } from "react-redux";
import windowSize from "react-window-size";
import { outsideClick } from "../../../../../actions/config";

const OutsideClick = (props, ref) => {
    const wrapperRef = useRef();

    const setWrapperRef = (node) => {
        wrapperRef = node;
    };
    const handleOutsideClick = (event) => {
        if (wrapperRef && !wrapperRef.current?.contains(event.target)) {
            if (props.windowWidth < 992 && props.collapseMenu) {
                props.onToggleNavigation();
            }
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    });

    return (
        <div className="nav-outside" ref={() => setWrapperRef}>
            {props.children}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        collapseMenu: state.config.collapseMenu,
    };
};

const mapDispatchToProps = (dispatch) => outsideClick(dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(forwardRef(OutsideClick)));

import React, { forwardRef } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import windowSize from "react-window-size";
import Aux from "../../../../../../hoc/_Aux";
import NavIcon from "./../NavIcon";
import NavBadge from "./../NavBadge";
import { navItem } from "../../../../../../actions/config";

const NavItem = (props, ref) => {
    let itemTitle = props.item.title;
    if (props.item.icon) {
        itemTitle = <span className="pcoded-mtext">{props.item.title}</span>;
    }

    let itemTarget = "";
    if (props.item.target) {
        itemTarget = "_blank";
    }

    let subContent;
    if (props.item.external) {
        subContent = (
            <a href={props.item.url} target="_blank" rel="noopener noreferrer">
                <NavIcon items={props.item} />
                {itemTitle}
                <NavBadge layout={props.layout} items={props.item} />
            </a>
        );
    } else {
        subContent = (
            <NavLink to={props.item.url} className="nav-link" exact={true} target={itemTarget}>
                <NavIcon items={props.item} />
                {itemTitle}
                <NavBadge layout={props.layout} items={props.item} />
            </NavLink>
        );
    }
    let mainContent = "";
    if (props.layout === "horizontal") {
        mainContent = <li onClick={props.onItemLeave}>{subContent}</li>;
    } else {
        if (props.windowWidth < 992) {
            mainContent = (
                <li className={props.item.classes} onClick={props.onItemClick}>
                    {subContent}
                </li>
            );
        } else {
            mainContent = <li className={props.item.classes}>{subContent}</li>;
        }
    }

    return <Aux>{mainContent}</Aux>;
};

const mapStateToProps = (state) => {
    return {
        layout: state.config.layout,
        collapseMenu: state.config.collapseMenu,
    };
};

const mapDispatchToProps = (dispatch) => navItem(dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(windowSize(forwardRef(NavItem))));

import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Aux from "../../../../../../hoc/_Aux";
import DEMO from "../../../../../../store/constant";
import NavIcon from "./../NavIcon";
import NavBadge from "./../NavBadge";
import NavItem from "../NavItem";
import { navCollapse } from "../../../../../../actions/config";

const NavCollapse = (props) => {
    const { isOpen, isTrigger } = props;
    const dataUser = useSelector((state) => state.user.dataUser);

    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split("/")
            .findIndex((id) => id === props.collapse.id);
        if (currentIndex > -1) {
            props.onCollapseToggle(props.collapse.id, props.type);
        }
    }, []);

    let navItems = "";
    if (props.collapse.children) {
        // if (dataUser.length !== 0) {
        // const idRole = dataUser[0].role_id;
        const collapses = props.collapse.children;
        navItems = Object.keys(collapses).map((item) => {
            item = collapses[item];
            switch (item.type) {
                case "item":
                    // if (item.role) {
                    // for (let i = 0; i < item.role.length; i++) {
                    // if ( idRole === item.role[ i ] ) return
                    <NavItem layout={props.layout} key={item.id} item={item} />;
                // else continue;
                // }
                // }
                // break;

                default:
                    return false;
            }
        });
        // }
    }

    let itemTitle = props.collapse.title;
    if (props.collapse.icon) {
        itemTitle = <span className="pcoded-mtext">{props.collapse.title}</span>;
    }

    let navLinkClass = ["nav-link"];

    let navItemClass = ["nav-item", "pcoded-hasmenu"];
    const openIndex = isOpen.findIndex((id) => id === props.collapse.id);
    if (openIndex > -1) {
        navItemClass = [...navItemClass, "active"];
        if (props.layout !== "horizontal") {
            navLinkClass = [...navLinkClass, "active"];
        }
    }

    const triggerIndex = isTrigger.findIndex((id) => id === props.collapse.id);
    if (triggerIndex > -1) {
        navItemClass = [...navItemClass, "pcoded-trigger"];
    }

    const currentIndex = document.location.pathname
        .toString()
        .split("/")
        .findIndex((id) => id === props.collapse.id);
    if (currentIndex > -1) {
        navItemClass = [...navItemClass, "active"];
        if (props.layout !== "horizontal") {
            navLinkClass = [...navLinkClass, "active"];
        }
    }

    const subContent = (
        <Aux>
            <a
                href={DEMO.BLANK_LINK}
                className={navLinkClass.join(" ")}
                onClick={() => props.onCollapseToggle(props.collapse.id, props.type)}
            >
                <NavIcon items={props.collapse} />
                {itemTitle}
                <NavBadge layout={props.layout} items={props.collapse} />
            </a>
            <ul className="pcoded-submenu">{navItems}</ul>
        </Aux>
    );
    let mainContent = "";
    if (props.layout === "horizontal") {
        mainContent = (
            <li
                className={navItemClass.join(" ")}
                onMouseLeave={() => props.onNavCollapseLeave(props.collapse.id, props.type)}
                onMouseEnter={() => props.onCollapseToggle(props.collapse.id, props.type)}
            >
                {subContent}
            </li>
        );
    } else {
        mainContent = <li className={navItemClass.join(" ")}>{subContent}</li>;
    }

    return <Aux>{mainContent}</Aux>;
};

const mapStateToProps = (state) => {
    return {
        layout: state.config.layout,
        isOpen: state.config.isOpen,
        isTrigger: state.config.isTrigger,
    };
};

const mapDispatchToProps = (dispatch) => navCollapse(dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavCollapse));

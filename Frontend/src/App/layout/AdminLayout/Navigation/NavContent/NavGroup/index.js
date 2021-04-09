import React from "react";
import { useSelector } from "react-redux";
import Aux from "../../../../../../hoc/_Aux";
import NavCollapse from "./../NavCollapse";
import NavItem from "./../NavItem";

const NavGroup = (props) => {
    const dataUser = useSelector((state) => state.user.dataUser);

    let navItems = "";
    if (props.group.children) {
        if (dataUser.length !== 0) {
            const idRole = dataUser[0].role_id;
            const groups = props.group.children;
            navItems = Object.keys(groups).map((item) => {
                item = groups[item];
                switch (item.type) {
                    case "collapse":
                        if (item.role) {
                            for (let i = 0; i < item.role.length; i++) {
                                if (idRole === item.role[i]) return <NavCollapse key={item.id} collapse={item} type="main" />;
                                else continue;
                            }
                        }
                        break;
                    case "item":
                        if (item.role) {
                            for (let i = 0; i < item.role.length; i++) {
                                if (idRole === item.role[i]) return <NavItem layout={props.layout} key={item.id} item={item} />;
                                else continue;
                            }
                        }
                        break;

                    default:
                        return false;
                }
            });
        }
    }

    return (
        <Aux>
            <li key={props.group.id} className="nav-item pcoded-menu-caption">
                <label>{props.group.title}</label>
            </li>
            {navItems}
        </Aux>
    );
};

export default NavGroup;

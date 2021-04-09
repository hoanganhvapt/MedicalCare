import React, { forwardRef, Suspense, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import windowSize from "react-window-size";
import Navigation from "./Navigation";
import NavBar from "./NavBar";
import Breadcrumb from "./Breadcrumb";
import Loader from "../Loader";
import routes from "../../../routes";
import Aux from "../../../hoc/_Aux";
import { collapseMenu } from "../../../actions/config";

const AdminLayout = (props, ref) => {
    const dataUser = useSelector((state) => state.user.dataUser);
    const mobileOutClickHandler = () => {
        if (props.windowWidth < 992 && props.collapseMenu) {
            props.onComponentWillMount();
        }
    };
    useEffect(() => {
        if (props.windowWidth > 992 && props.windowWidth <= 1024 && props.layout !== "horizontal") {
            props.onComponentWillMount();
        }
    }, []);

    const menu = routes.map((route, index) => {
        if (dataUser.length !== 0) {
            const idRole = dataUser[0].role_id;
            if (route.role) {
                for (let i = 0; i < route.role.length; i++) {
                    if (idRole === route.role[i]) {
                        return route.component ? (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                render={(props) => <route.component {...props} />}
                            />
                        ) : null;
                    } else continue;
                }
            }
        }
    });

    return (
        <Aux>
            <Navigation />
            <NavBar />
            <div className="pcoded-main-container" onClick={mobileOutClickHandler}>
                <div className="pcoded-wrapper">
                    <div className="pcoded-content">
                        <div className="pcoded-inner-content">
                            <Breadcrumb />
                            <div className="main-body">
                                <div className="page-wrapper">
                                    <Suspense fallback={<Loader />}>
                                        <Switch>
                                            {menu}
                                            <Redirect from="/" to={props.defaultPath} />
                                        </Switch>
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

const mapStateToProps = (state) => {
    return {
        defaultPath: state.config.defaultPath,
        collapseMenu: state.config.collapseMenu,
        configBlock: state.config.configBlock,
        layout: state.config.layout,
    };
};

const mapDispatchToProps = (dispatch) => collapseMenu(dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(forwardRef(AdminLayout)));

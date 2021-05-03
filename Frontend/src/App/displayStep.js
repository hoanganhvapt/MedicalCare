import React, { Suspense, useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import Loadable from "react-loadable";
import Loader from "./layout/Loader";
import Aux from "../hoc/_Aux";
import ScrollToTop from "./layout/ScrollToTop";
import routes from "../route";
import { CheckSession } from "./indexSevice";
import { useDispatch, useSelector } from "react-redux";
import { getDataUser } from "../actions/user";
import jwt from "jsonwebtoken";
import NavBar from "../App/layout/UserLayout/Navbar/NavbarTop";
import NavbarBottom from "../App/layout/UserLayout/Navbar/NavbarBottom";
import StepContext from "../App/layout/AdminLayout/EmpRegister/stepForm/StepContext"

const AdminLayout = Loadable({
    loader: () => import("./layout/AdminLayout"),
    loading: Loader,
});

const UserLayout = Loadable({
    loader: () => import("./layout/UserLayout/Home/Home"),
    loading: Loader,
});

const SignIn = Loadable({
    loader: () => import("./layout/UserLayout/SignIn/SignIn"),
    loading: Loader,
});

const FeedBack = Loadable({
    loader: () => import("./layout/UserLayout/FeedBack/Form"),
    loading: Loader,
});

const Contact = Loadable({
    loader: () => import("./layout/UserLayout/ContactUs/index"),
    loading: Loader,
});

const EmpRegister = Loadable({
    loader: () => import("./layout/AdminLayout/EmpRegister/index"),
    loading: Loader,
});

const DisplayEmp = Loadable({
    loader: () => import("./layout/AdminLayout/EmpRegister/displayEmp/DisplayEmp"),
    loading: Loader,
});

const App = (props) => {
    const dispatch = useDispatch();
    const checkDataUser = useSelector((state) => state.user.dataUser);
    const [dataUser, setDataUser] = useState();
    const location = useLocation();
    const menu = routes.map((route, index) => {
        return route.component ? (
            <Route
                key={index}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={(props) => <route.component {...props} />}
            />
        ) : null;
    });
    useEffect(() => {
        CheckSession()
            .then((res) => {
                console.log(res.data);
                let result = res.data;
                if (result.status === 404) return setDataUser("signin");
                setDataUser("logged");
                if ((result.status === 200) & (checkDataUser.length === 0)) {
                    let tokenSecret = "congtytnhhprintway@printway.io";
                    let salt = result.token.split(".")[1].substr(2, 37);
                    let removeSalt = result.token.replace(salt, "");
                    let decodeToken = jwt.verify(removeSalt, tokenSecret);
                    dispatch(getDataUser({ dataUser: decodeToken.data }));
                }
            })
            .catch((err) => console.log(err));
    }, [location.pathname]);
    return (
        <Aux>
            <NavBar />
            <ScrollToTop>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        {menu} 
                        <StepContext>
                            <Route path="/admin/employee-register" exact component={EmpRegister} />
                        </StepContext>
                        </Switch>
                </Suspense>
            </ScrollToTop>
            <NavbarBottom />
        </Aux>
    );
};

export default App;

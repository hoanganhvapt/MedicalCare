import React from "react";
import Aux from "../../hoc/_Aux";
import NewIndex from "../Charts/dashboard/NewIndex";
import Nvd3Chart from "../Charts/Nvd3Chart/index";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const dataUser = useSelector((state) => state.user.dataUser[0]);
    return <Aux>{dataUser.role_id === 6 ? <Nvd3Chart /> : <NewIndex />}</Aux>;
};

export default Dashboard;

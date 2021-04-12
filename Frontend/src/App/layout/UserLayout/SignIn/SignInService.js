import axios from "axios";

export const Login = () => {
    let url = "/api/adminlogin";
    return axios.get(url);
};

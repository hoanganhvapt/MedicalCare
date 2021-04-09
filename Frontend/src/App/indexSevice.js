import axios from "axios";

axios.defaults.withCredentials = false;

export const SignOut = () => {
    let url = "/api/SignOut";
    return axios.get(url);
};

export const CheckSession = () => {
    let url = "/api/adminlogin";
    return axios.get(url);
};

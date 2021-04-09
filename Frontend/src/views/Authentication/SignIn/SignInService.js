import axios from "axios";

export const Login = (data) => {
    let url = "/api/auth/signin";
    return axios.post(url, data);
};

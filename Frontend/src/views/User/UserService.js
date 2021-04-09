import axios from "axios";

export const getSellerName = (id) => {
    let url = "/api/sellerName";
    return axios.post(url, id);
};

export const getListSeller = () => {
    let url = "/api/list-seller";
    return axios.post(url);
};

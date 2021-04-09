import axios from "axios";

export const getSites = () => {
    let url = "/api/sites";
    return axios.post(url);
};

export const getListSiteByUserId = (user_id) => {
    let url = "/api/list-site";
    return axios.post(url, user_id);
};

export const getSiteById = (id) => {
    let url = "/api/site";
    return axios.post(url, id);
};

export const addNewSite = (req) => {
    let url = "/api/add-site";
    return axios.post(url, req);
};

export const updateSite = (req) => {
    let url = "/api/update-site";
    return axios.put(url, req);
};

export const deleteSite = (id) => {
    let url = "/api/delete-site";
    return axios.post(url, id);
};

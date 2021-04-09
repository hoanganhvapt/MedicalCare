import axios from "axios";

export const getListProduct = () => {
    let url = "/api/list-product";
    return axios.get(url);
};

export const getListProductType = () => {
    let url = "/api/list-product-type";

    return axios.get(url);
};

export const getListSupplier = () => {
    let url = "/api/list-supplier";

    return axios.get(url);
};

export const getListCategory = () => {
    let url = "/api/list-category";

    return axios.get(url);
};

export const getListCarrier = () => {
    let url = "/api/list-carrier";

    return axios.get(url);
};

export const getCategoryById = (id) => {
    let url = "/api/category";

    return axios.post(url, id);
};

export const getCarrierById = (id) => {
    let url = "/api/carrier";
    return axios.post(url, id);
};

export const getSaleChannel = () => {
    let url = "/api/getSaleChannel";
    return axios.get(url);
};

export const updateCategory = (req) => {
    let url = "/api/update-category";

    return axios.put(url, req);
};

export const updateImageProductType = (req) => {
    let url = "/api/update-image";

    return axios.put(url, req);
};

export const deleteCategory = (id) => {
    let url = "/api/delete-category";

    return axios.post(url, id);
};

export const addNewCarrier = (req) => {
    let url = "/api/add-carrier";

    return axios.post(url, req);
};

export const addNewSupplier = (req) => {
    let url = "/api/add-supplier";

    return axios.post(url, req);
};

export const addNewCategory = (req) => {
    let url = "/api/add-category";

    return axios.post(url, req);
};

export const addNewProductType = (req) => {
    let url = "/api/add-product-type";
    return axios.post(url, req, { header: { "Content-Type": "application/json" } });
};

export const addNewProduct = (req) => {
    let url = "/api/add-product";
    return axios.post(url, req);
};

export const uploadProductTypeImage = (req) => {
    let url = "/api/upload-image-product-type";
    return axios.post(url, req, { headers: { "Content-Type": "multipart/form-data" } });
};

export const uploadProductImage = (req) => {
    let url = "/api/upload-image-product";
    return axios.post(url, req, { headers: { "Content-Type": "multipart/form-data" } });
};

import axios from "axios";

export const getOrderByStore = (store_id) => {
    let url = "/api/list-order-by-store";
    return axios.post(url, store_id);
};

export const getOrderByDate = (date) => {
    let url = "/api/list-order-by-date";
    return axios.post(url, date);
};

export const getOrderBySupplier = (sup_code) => {
    let url = "/api/list-order-by-supplier";
    return axios.post(url, sup_code);
};

export const getOrderByProduct = (prod_code) => {
    let url = "/api/list-order-by-product";
    return axios.post(url, prod_code);
};

export const getOrderBySeller = (user_id) => {
    let url = "/api/list-order-by-seller";
    return axios.post(url, user_id);
};

export const getFilterProd = () => {
    let url = "api/filter-prod";
    return axios.get(url);
};

export const getFilterSup = () => {
    let url = "api/filter-sup";
    return axios.get(url);
};

export const getListOrder = (request) => {
    let url = "/api/list-order";
    return axios.post(url, request);
};

export const getImportSite = (request) => {
    let url = "/api/list-site-import";
    return axios.post(url, request);
};
export const getDetailOrder = (order_number) => {
    let url = "/api/order";
    return axios.post(url, order_number);
};
export const getCarrier = (store_product_id) => {
    let url = "/api/getCarrier";
    return axios.post(url, store_product_id);
};
export const getTracking = (order_id) => {
    let url = "/api/getTracking";
    return axios.post(url, order_id);
};
export const getUserConfirm = (user_id) => {
    let url = "/api/getUserConfirm";
    return axios.post(url, user_id);
};
export const uploadRequestImage = (req) => {
    let url = "/api/uploadImage";
    return axios.post(url, req);
};
export const uploadNewDesign = (req) => {
    let url = "/api/uploadDesign";
    return axios.post(url, req);
};

export const updateNewDesign = (req) => {
    let url = "/api/updateDesign";
    return axios.post(url, req);
};

// Accept or deny request order
export const uploadRequestAccept = (req) => {
    let url = "/api/checkRequest";
    return axios.post(url, req);
};
export const uploadRequestDeny = (req) => {
    let url = "/api/checkRequest";
    return axios.post(url, req);
};

export const uploadRequestCancel = (order_number) => {
    let url = "/api/request-cancel";
    return axios.post(url, order_number);
};
export const uploadRequestResend = (order_number) => {
    let url = "/api/request-resend";
    return axios.post(url, order_number);
};
export const uploadRequestRefund = (order_number) => {
    let url = "/api/request-refund";
    return axios.post(url, order_number);
};
export const uploadRequestPartRefund = (order_number) => {
    let url = "/api/request-part-refund";
    return axios.post(url, order_number);
};

export const uploadAcceptConfirm = (order_number) => {
    let url = "/api/accept-confirm";
    return axios.post(url, order_number);
};

export const uploadDenyConfirm = (order_number) => {
    let url = "/api/deny-confirm";
    return axios.post(url, order_number);
};

export const getUnpaidListOrder = () => {
    let url = "/api/unpaid-list-order";
    return axios.get(url);
};

export const getPaidListOrder = () => {
    let url = "/api/paid-list-order";
    return axios.get(url);
};

export const getInvoiceDetail = (order_number) => {
    let url = "/api/invoice-detail";
    return axios.post(url, order_number);
};

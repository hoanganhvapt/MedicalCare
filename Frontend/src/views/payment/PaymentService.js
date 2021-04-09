import axios from "axios";

export const getSignUpPaypal = (userId) => {
    let url =
        "http://192.168.1.48:8080/paypal/v1/" + userId + "/get-link-signup";
    return axios.post(url);
};

export const getSignUpStripe = (userId) => {
    let url =
        "http://192.168.1.48:8080/stripe/v1/" + userId + "/create-setup-intent";
    return axios.post(url);
};

export const paymentPaypal = (userId, req) => {
    let url = "http://192.168.1.48:8080/paypal/v1/" + userId + "/create-order";
    return axios.post(url, req);
};

export const paymentStripe = (userId, req) => {
    let url = "http://192.168.1.48:8080/stripe/v1/" + userId + "/create-order";
    return axios.post(url, req);
};

export const saveCardDuringPayment = (userId, req) => {
    let url =
        "http://192.168.1.48:8080/stripe/v1/" + userId + "/create-saving-card";
    return axios.post(url, req);
};

export const createSetupIntnent = (userId) => {
    let url =
        "http://192.168.1.48:8080/stripe/v1/" + userId + "/create-setup-intent";
    return axios.post(url);
};
export const getCardList = (userId) => {
    let url = "/api/card-list";
    return axios.post(url, userId);
};
export const getUnpaidListOrder = (userId) => {
    let url =
        "http://192.168.1.48:8080/printway/v1/" + userId + "/get-orders-unpaid";
    return axios.get(url);
};

export const getPaidListOrder = (userId) => {
    let url =
        "http://192.168.1.48:8080/printway/v1/" + userId + "/get-orders-paid";
    return axios.get(url);
};

export const getInvoiceDetail = (order_number) => {
    let url = "/api/invoice-detail";
    return axios.post(url, order_number);
};

export const completedSetupIntent = (cusToken) => {
    let url =
        "http://192.168.1.48:8080/stripe/v1/" +
        cusToken +
        "/complete-setup-intent";
    return axios.post(url);
};
export const completedPaymentIntnent = (req) => {
    let url = "http://192.168.1.48:8080/stripe/v1/complete-payment-intent";
    return axios.post(url, req);
};

export const semiPay = (userId, req) => {
    let url =
        "http://192.168.1.48:8080/stripe/v1/" + userId + "/create-semipay";
    return axios.post(url, req);
};

export const deletePaymentMethod = (req) => {
    let url = "http://192.168.1.48:8080/stripe/v1/delete-payment-method";
    console.log(req);
    return axios.post(url, req);
};

export const getAutoPayStatus = (req) => {
    let url = "/api/auto-pay-status";
    return axios.post(url, req);
};

export const getAutoCard = (req) => {
    let url = "/api/auto-card";
    return axios.post(url, req);
};

export const setDefaultCard = (req) => {
    console.log(req);
    let url = "/api/set-auto-card";
    return axios.post(url, req);
};

export const setAutoPaymentStatus = (req) => {
    let url = "/api/set-auto-pay-status";
    return axios.post(url, req);
};

export const setOffAutoPayStatus = (req) => {
    let url = "/api/off-auto-pay-status";
    return axios.post(url, req);
};

export const setOffDefault = (req) => {
    let url = "/api/off-default";
    return axios.post(url, req);
};

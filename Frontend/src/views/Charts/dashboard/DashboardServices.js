import axios from "axios";

const token = {
    headers: {'Request-Secret-Token': '2'},
};

// const local_base_url = 'https://pro.printway.io/shopify/public';
const local_base_url = 'http://192.168.1.47:8800';

const services = {
    //sellers
    getSellerData: (req) => {
        let url = "/api/get-seller-data";
        return axios.post(url, req);
    },

    //product types
    // getProductTypeData: (req) => {
    //     let url = "/api/get-product-type-data";
    //     return axios.post(url, req);
    // },

    //orders
    apiGetOrderData: (req) => {
        let url = local_base_url + "/api/get-order-data"
        return axios.post(url, req, token);
    },

    //call api get revenues data
    getRevData: (req) => {
        let url = local_base_url + "/api/get-rev-data"
        return axios.post(url, req, token);
    },

    //call api get product data
    getProductData: (req) => {
        let url = local_base_url + "/api/get-product-data"
        return axios.post(url, req, token);
    },

    //call api get product type data
    apiGetProductTypeData: (req) => {
        let url = local_base_url + "/api/get-product-type-data-php"
        return axios.post(url, req, token)
    },

    //call api test
    callApi: () => {
        let url = local_base_url + "/api/test-api-call-php"
        return axios.get(url, token)
    },

    //call api get profit data
    apiGetProfit: (req) =>{
        let url = local_base_url + "/api/get-profit-data"
        return axios.post(url, req, token)
    },
}
export default services;
// export const getSellerData = () => {
//     let url = "/api/get-seller-data";
//     return axios.get(url);
// };
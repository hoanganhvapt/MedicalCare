import React, {useEffect, useState} from 'react';
import NVD3Chart from 'react-nvd3';
import services from "./DashboardServices";



const ProductTypePieChart = (props) => {
    //get global variants
    const {globalDateRange, globalPlatform} = props

    //start date
    const [dateRange, setGlobalDateRange] = useState(globalDateRange);

    //end date
    // const [endDate, setEndDate] = useState(new Date(globalEndDate));

    // console.log(flag);

    //data
    const [datum, setDatum] = useState([
        {key: "One", y: 29, color: "#ff8a65"},
        {key: "Two", y: 0, color: "#f4c22b"},
        {key: "Three", y: 32, color: "#04a9f5"},
        {key: "Four", y: 196, color: "#3ebfea"},
        {key: "Five", y: 2, color: "#4F5467"},
        {key: "Six", y: 98, color: "#1de9b6"},
        {key: "Seven", y: 13, color: "#a389d4"},
        {key: "Eight", y: 5, color: "#FE8A7D"}
    ]);
    // const datum = [
    //     {key: "One", y: 29, color: "#ff8a65"},
    //     {key: "Two", y: 0, color: "#f4c22b"},
    //     {key: "Three", y: 32, color: "#04a9f5"},
    //     {key: "Four", y: 196, color: "#3ebfea"},
    //     {key: "Five", y: 2, color: "#4F5467"},
    //     {key: "Six", y: 98, color: "#1de9b6"},
    //     {key: "Seven", y: 13, color: "#a389d4"},
    //     {key: "Eight", y: 5, color: "#FE8A7D"}
    // ]

    //color for each data
    const COLORS = ['#3ebfea', '#1de9b6', '#FE8A7D', '#a389d4', '#ff8a65'];


    //function get product type data
    const getProductTypeData = (dateRange = [], platform) => {
        // if (flag %2 === 0)
        services.apiGetProductTypeData({
            dateRange: dateRange,
            platform: platform,
        }).then(res => {
            let response_raw = res.data.result;
            let data_response = [];
            for (let i = 0; i < response_raw.length; i++) {
                data_response.push({key: response_raw[i].prod_name, value: response_raw[i].count, color: COLORS[i]})
            }
            setGlobalDateRange(globalDateRange);
            setDatum(data_response);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getProductTypeData(globalDateRange, globalPlatform);
    }, [globalDateRange, globalPlatform]);
    return <NVD3Chart id="chart" height={300} type="pieChart" datum={datum} x="key" y="value" donut labelType='percent'/>
}

export default ProductTypePieChart;
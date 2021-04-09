import React, {useEffect, useState} from 'react';
import NVD3Chart from 'react-nvd3';
import services from "./DashboardServices";

const TotalOrderMultiBarChart = (props) => {

    //get global variants
    const {globalDateRange, globalPlatform} = props

    //date range
    const [dateRange, setGlobalDateRange] = useState(globalDateRange)

    //generate random number in a range
    const generateNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const getDatum = () => {
        let sin = [],
            sin2 = [],
            sin3 = [];

        const len = 35;
        for (let i = 0; i < len; i++) {
            sin.push({
                'x': i,
                'y': generateNumber(0, 60)
            });
            sin2.push({
                'x': i,
                'y': generateNumber(0, 100)
            });
            sin3.push({
                'x': i,
                'y': generateNumber(0, 30)
            });
        }
        return [
            {
                values: sin,
                key: 'Shopify',
                color: '#A389D4'
            },
            {
                values: sin3,
                key: 'Amazon',
                color: '#04a9f5'
            },

        ];
    }

    const getDatum2 = (platform, dateRange, date = [], totalOrders1 = [], totalOrders2 = [], platform1, platform2) => {
        let sin = [],
            sin3 = [];
        for (let i = 0; i < dateRange; i++) {
            if(platform[i] === 'Shopify'){
                sin.push({
                    'x': date[i],
                    'y': totalOrders1[i]
                });
            }
            else{
                sin.push({
                    'x': date[i],
                    'y': 0
                });
            }
            if(platform[i]==='Amazon'){
                sin3.push({
                    'x': date[i],
                    'y': totalOrders2[i]
                });
            }
            else{
                sin3.push({
                    'x': date[i],
                    'y': 0
                });
            }
        }
        return [
            {
                values: sin,
                key: platform1,
                color: '#03C426'
            },
            {
                values: sin3,
                key: platform2,
                color: '#F16808'
            },

        ];
    }

    //get data
    const [data, setData] = useState(getDatum());

    const getOrderData = (dateRange = []) => {
        services.apiGetOrderData({
            dateRange: dateRange,
        }).then(res => {
            let response_raw = res.data.result;
            let shopify_orders = [];
            let amazon_orders = [];
            let date = [];
            let platform = [];
            for(let i = 0; i< response_raw.length; i++){
                date.push(response_raw[i].order_date);
                platform.push(response_raw[i].platform);
            }
            for(let i = 0; i< response_raw.length; i++){
                if(response_raw[i].platform==='Shopify'){
                    shopify_orders.push(response_raw[i].total);
                    amazon_orders.push(0);
                }
                else{
                    amazon_orders.push(response_raw[i].total);
                    shopify_orders.push(0)
                }
            }
            let data_response = getDatum2(platform, response_raw.dateRange, date, shopify_orders, amazon_orders, 'Shopify', 'Amazon')
            setGlobalDateRange(globalDateRange);
            // console.log(date);
            setData(data_response);
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        getOrderData(globalDateRange, globalPlatform);
    }, [globalDateRange])

    return <NVD3Chart type="multiBarChart" datum={data} x="label" y="value" height={300} showValues groupSpacing={0.04}/>
}

export default TotalOrderMultiBarChart;
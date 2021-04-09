import React, {useEffect, useState} from 'react';
import NVD3Chart from 'react-nvd3';
import services from "./DashboardServices";



const MultiBarChart = (props) => {

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

    const getDatum2 = (length, dateRange, date1 = [], totalRev1 = [], totalRev2 = [], platform1, platform2) => {
        let sin = [],
            sin3 = [];
        for (let i = 0; i < dateRange; i++) {
            sin.push({
                'x': date1[i],
                'y': totalRev1[i]
            });
            sin3.push({
                'x': date1[i],
                'y': totalRev2[i]
            });
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

    const getRevData = (dateRange = []) => {
        services.getRevData({
            dateRange: dateRange,
        }).then(res => {
            let response_raw = res.data.result;
            let totalRev1 = [];
            let totalRev2 = [];
            let date1 = [];
            let length = 0;
            for(let i = 0; i<response_raw.shopify.length; i++){
                totalRev1.push(response_raw.shopify[i].total_rev);
            }
            for(let i = 0; i<response_raw.amazon.length; i++){
                totalRev2.push(response_raw.amazon[i].total_rev);
            }
            if(response_raw.shopify.length>response_raw.amazon.length){
                length += response_raw.shopify.length
                for(let i = 0; i<response_raw.shopify.length; i++){
                    date1.push(response_raw.shopify[i].payment_date);
                }
            }
            else{
                length += response_raw.amazon.length
                for(let i = 0; i<response_raw.shopify.length; i++){
                    date1.push(response_raw.amazon[i].payment_date);
                }
            }
            let data_response = getDatum2(length, response_raw.dateRange, date1, totalRev1, totalRev2, 'Shopify', 'Amazon')
            setGlobalDateRange(globalDateRange);
            setData(data_response);
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        getRevData(globalDateRange);
    }, [globalDateRange])

    return <NVD3Chart type="multiBarChart" datum={data} x="x" y="y" height={300} showValues groupSpacing={0.2}/>
}

export default MultiBarChart;
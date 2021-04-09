import React, {useEffect, useState} from 'react';
import NVD3Chart from 'react-nvd3';
import services from "./DashboardServices";

const ProfitLineChart = (props) => {
    //get global variants
    const {globalDateRange, globalPlatform} = props

    //start date
    const [dateRange, setGlobalDateRange] = useState(new Date(globalDateRange));

    const getDatum = () => {
        var sin = [],
            sin2 = [],
            cos = [];
        for (var i = 0; i < 100; i++) {
            sin.push({
                'x': i,
                'y': Math.sin(i / 10)
            });
            sin2.push({
                'x': i,
                'y': Math.sin(i / 10) * 0.25 + 0.5
            });
            cos.push({
                'x': i,
                'y': .5 * Math.cos(i / 10)
            });
        }
        return [
            {
                values: sin,
                key: 'wave1',
                color: '#A389D4'
            },
            {
                values: cos,
                key: 'Cosine Wave',
                color: '#04a9f5'
            },
            {
                values: sin2,
                key: 'Another sine wave',
                color: '#1de9b6',
                area: true
            }
        ];
    }

    //data
    const [datum, setDatum] = useState(getDatum());
    const COLORS = ['#A389D4', '#04a9f5', '#1de9b6'];

    const getProfit = (dateRange=[], platform) => {
        services.apiGetProfit({
            dateRange: dateRange,
            // platform: platform
        }).then(res => {
            let response_raw = res.data.data;
            console.log(response_raw);
            let data_response = [];
            for (let i = 0; i < response_raw.length; i++) {
                data_response.push(getDatum(response_raw[i].user_name, COLORS[i]));
            }
            console.log(data_response);
            setGlobalDateRange(globalDateRange);
            setDatum(data_response);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        // getProfit(globalDateRange)
    }, [globalDateRange]);
    return (
        <div>
            {
                React.createElement(NVD3Chart, {
                    xAxis: {
                        tickFormat: function (d) {
                            return d;
                        },
                        axisLabel: 'Time (ms)'
                    },
                    yAxis: {
                        axisLabel: 'Voltage (v)',
                        tickFormat: function (d) {
                            return parseFloat(d).toFixed(2);
                        }
                    },
                    type: 'lineChart',
                    datum: datum,
                    x: 'x',
                    y: 'y',
                    height: 300,
                    renderEnd: function () {
                        console.log('renderEnd');
                    }
                })
            }
        </div>
    )
}

export default ProfitLineChart;
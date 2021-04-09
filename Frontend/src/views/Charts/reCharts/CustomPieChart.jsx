// import React, {useEffect, useState} from 'react';
// import {PieChart, Cell, Pie, Sector, ResponsiveContainer} from 'recharts';
// import services from '../dashboard/DashboardServices';
// import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
// import DateFnsUtils from '@date-io/date-fns';
// import Select from "react-select";
// import {Grid} from "@material-ui/core";
// import SearchIcon from '@material-ui/icons/Search';
// import {Button} from "react-bootstrap"
//
//
// const CustomPieChart = (props) => {
//
//
//     const renderActiveShape = (props) => {
//         const RADIAN = Math.PI / 180;
//         const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props;
//         const sin = Math.sin(-RADIAN * midAngle);
//         const cos = Math.cos(-RADIAN * midAngle);
//         const sx = cx + (outerRadius + 10) * cos;
//         const sy = cy + (outerRadius + 10) * sin;
//         const mx = cx + (outerRadius + 30) * cos;
//         const my = cy + (outerRadius + 30) * sin;
//         const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//         const ey = my;
//         const textAnchor = cos >= 0 ? 'start' : 'end';
//         return (
//             <g>
//                 <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
//                     {payload.name}
//                 </text>
//                 <Sector
//                     cx={cx}
//                     cy={cy}
//                     innerRadius={innerRadius}
//                     outerRadius={outerRadius}
//                     startAngle={startAngle}
//                     endAngle={endAngle}
//                     fill={fill}
//                 />
//                 <Sector
//                     cx={cx}
//                     cy={cy}
//                     startAngle={startAngle}
//                     endAngle={endAngle}
//                     innerRadius={outerRadius + 6}
//                     outerRadius={outerRadius + 10}
//                     fill={fill}
//                 />
//                 <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
//                 <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
//                 <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor}
//                       fill="#333">{`Total sales: ${value}`}</text>
//                 <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
//                     {`(Rate ${(percent * 100).toFixed(2)}%)`}
//                 </text>
//             </g>
//         );
//     };
//
//
//
//
//     //color for each data
//     const COLORS = ['#FF8042', '#0088FE', '#ed0c23', '#FFBB28', '#00C49F'];
//
//     //save active data
//     const [activeIndex, setActiveIndex] = useState(0);
//
//     //function set active data
//     const onPieEnter = (_, index) => {
//         setActiveIndex(index);
//     };
//
//
//     return (
//         <>
//             <ResponsiveContainer width="100%" height="100%">
//                 <PieChart width={400} height={400}>
//                     <Pie
//                         activeIndex={activeIndex}
//                         activeShape={renderActiveShape}
//                         data={data}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         onMouseEnter={onPieEnter}
//                         onChange={getData}
//                     >
//                         {data.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
//                         ))}
//                     </Pie>
//                 </PieChart>
//             </ResponsiveContainer>
//         </>
//     );
// }
// export default CustomPieChart;
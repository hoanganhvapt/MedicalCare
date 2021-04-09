import React, {useEffect, useState} from 'react';
import {Row, Col, Card} from 'react-bootstrap';

import Aux from "../../../hoc/_Aux/index";
import TotalOrderMultiBarChart from "./TotalOrderMultiBarChart";
import ProductTypePieChart from "./ProductTypePieChart";
import MultiBarChart from "./MultiBarChart";
import PieDonutChart from "./PieDonutChart";
import {Grid} from "@material-ui/core";
import { DatePicker, Space,  Button, Select  } from 'antd';
import moment from 'moment';
import ProductPieChart from './ProductPieChart';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import ProfitLineChart from "./ProfitLineChart";

const NewIndex = (props) => {

    //ant date range picker
    const { RangePicker } = DatePicker;
    const [globalDateRange, setGlobalDateRange] = useState([moment('2021-03-01'), moment(new Date())]);

    //ant select
    const { Option } = Select;
    const [globalPlatformOptions, setGlobalPlatformOptions] = useState('all');
    const [globalSellerTypeOptions, setGlobalSellerTypeOptions]  = useState('0');

    let sellerValue = -1;

    //flag
    const [flag, setFlag] = useState({
        pieChart: sellerValue,
    });

    //handle more filter
    const handleMoreFilter = () => {

    }


    //handle submit
    const handleSubmit = () => {

    }

    return (
        <Aux>
            <Grid container spacing={2}>
                <Grid item container xs={12}>
                    <Grid item style={{ marginRight: "1rem"}}>
                        <Space direction="vertical" size={12}>
                            <RangePicker
                                defaultValue={globalDateRange}
                                onChange={date => setGlobalDateRange(date)}
                            />
                        </Space>
                    </Grid>
                    <Grid item style={{ marginRight: "1rem"}}>
                        {/*<Select defaultValue={globalSellerTypeOptions} style={{ width: 220 }} onChange={typeOptions => setGlobalSellerTypeOptions(typeOptions)}>*/}
                        {/*    <Option value="0">Total sales</Option>*/}
                        {/*    <Option value="1">Profit</Option>*/}
                        {/*</Select>*/}
                    </Grid>
                    <Grid item style={{ marginRight: "1rem"}}>
                        <Select defaultValue={globalPlatformOptions} style={{ width: 220 }} onChange={platformOptions => setGlobalPlatformOptions(platformOptions)}>
                            <Option value="all">All platforms</Option>
                            <Option value="Shopify">Shopify</Option>
                            <Option value="Amazon">Amazon</Option>
                            <Option value="woocommerce">Woocommerce</Option>
                        </Select>
                    </Grid>
                    {/*<Grid item style={{ marginRight: "0.5rem"}}>*/}
                    {/*    <Button icon={<FilterOutlined />} type="danger" style={{ display: 'flex', alignItems: 'center'}}>More filter</Button>*/}
                    {/*</Grid>*/}
                    {/*<Grid item>*/}
                    {/*    <Button icon={<SearchOutlined />} type="danger" style={{ display: 'flex', alignItems: 'center'}} onClick={handleSubmit}>*/}
                    {/*        Filter*/}
                    {/*    </Button>*/}
                    {/*</Grid>*/}
                </Grid>
            </Grid>
            <br/>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Profit</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <ProfitLineChart globalDateRange={globalDateRange}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Total orders</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <TotalOrderMultiBarChart globalDateRange={globalDateRange} globalPlatform={globalPlatformOptions}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Total Revenue ($)</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <MultiBarChart globalDateRange={globalDateRange} platform='all'/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Top 5 Product units sold</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <ProductPieChart globalPlatform={globalPlatformOptions} globalDateRange={globalDateRange}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Top 5 Product types</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <ProductTypePieChart globalPlatform={globalPlatformOptions} globalDateRange={globalDateRange}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Top 5 sellers</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <PieDonutChart globalDateRange={globalDateRange}
                                           globalPlatform={globalPlatformOptions} flag={flag.pieChart}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Top 5 suppliers</Card.Title>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <PieDonutChart/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );
}

export default NewIndex;
import React, { useEffect, useState } from "react";
import { getInvoiceDetail } from "./PaymentService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Grid } from "@material-ui/core";
import MaterialTable from "material-table";
import { Typography } from "antd";

const { Text } = Typography;
const { Title } = Typography;

toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const OrderDetail = (props) => {
    const { order_number } = useParams();
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [firstData, setFirstData] = useState({});
    const [orderAmount, setOrderAmount] = useState();

    const updateTableData = () => {
        getInvoiceDetail({ id: order_number })
            .then((res) => {
                let result = res.data.data;
                console.log(result);
                let tempArr = [];
                let amount = 0;
                if (result.length === 0)
                    return props.history.push("/billing/transaction-history");
                for (let i = 0; i < result.length; i++) {
                    let tmp = result[i].dtime_entered.split("T");
                    result[i].dtime_entered = tmp[0];
                    let tmpPayDate = result[i].payment_date.split("T");
                    result[i].payment_date = tmpPayDate[0];
                    tempArr.push(result[i]);
                    amount +=
                        result[i].ord_price * result[i].unfulfill_quantity;
                    if (i === 0) setFirstData(result[i]);
                }
                setOrderAmount(amount);
                setData(tempArr);
            })
            .catch((err) => toast.error(err));
    };
    useEffect(() => {
        updateTableData();
    }, []);
    console.log(data);
    const columns = [
        {
            title: "Product name",
            field: "product_name",
            align: "center",
        },
        {
            title: "Quantity",
            field: "unfulfill_quantity",
            align: "center",
        },
        {
            title: "Unit price",
            // field: "ord_price",
            align: "center",
            render: (rowData) => {
                return <p>{rowData.ord_price} $</p>;
            },
        },
        {
            title: "Total price",
            // field: "type",
            align: "center",
            render: (rowData) => {
                return (
                    <p>{rowData.ord_price * rowData.unfulfill_quantity} $</p>
                );
            },
        },
    ];

    return (
        <>
            <Card>
                <Card.Header>
                    <h3>Order #{order_number}</h3>
                    <h6>
                        Order placed on {firstData.dtime_entered} by{" "}
                        {firstData.user_name}
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Grid container xs={12}>
                        <Grid item xs={8}>
                            <Card>
                                <Grid container spacing={2}>
                                    <Grid container item xs={6}>
                                        <Grid
                                            item
                                            xs={12}
                                            style={{
                                                borderBottom: "1px solid gray",
                                            }}
                                        >
                                            <Title
                                                style={{
                                                    paddingTop: "1rem",
                                                    paddingLeft: "2rem",
                                                }}
                                                level={4}
                                            >
                                                Invoice
                                            </Title>
                                        </Grid>
                                        <Grid
                                            container
                                            item
                                            xs={12}
                                            justify="space-between"
                                        >
                                            <Text
                                                style={{
                                                    paddingTop: "1rem",
                                                    paddingLeft: "1rem",
                                                    paddingBottom: "1rem",
                                                }}
                                                type="secondary"
                                            >
                                                Date ordered
                                            </Text>
                                            <Text
                                                style={{
                                                    paddingTop: "1rem",
                                                    paddingRight: "1rem",
                                                    paddingBottom: "1rem",
                                                }}
                                                type="default"
                                            >
                                                {firstData.dtime_entered}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                item
                                                xs={12}
                                                justify="space-between"
                                            >
                                                <Text
                                                    style={{
                                                        // paddingTop: "1rem",
                                                        paddingLeft: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    type="secondary"
                                                >
                                                    Payment date
                                                </Text>
                                                <Text
                                                    style={{
                                                        // paddingTop: "1rem",
                                                        paddingRight: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    type="default"
                                                >
                                                    {firstData.payment_date}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container item xs={6}>
                                        <Grid
                                            item
                                            xs={12}
                                            style={{
                                                borderBottom: "1px solid gray",
                                            }}
                                        >
                                            <Title
                                                style={{
                                                    paddingTop: "1rem",
                                                    paddingLeft: "2rem",
                                                    paddingBottom: "1rem",
                                                }}
                                                level={4}
                                            >
                                                Tracking
                                            </Title>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                item
                                                xs={12}
                                                justify="space-between"
                                            >
                                                <Text
                                                    style={{
                                                        paddingTop: "1rem",
                                                        paddingLeft: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    type="secondary"
                                                >
                                                    Shipping address
                                                </Text>
                                                <Text
                                                    style={{
                                                        paddingTop: "1rem",
                                                        paddingRight: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    type="default"
                                                >
                                                    {
                                                        firstData.shipping_address1
                                                    }
                                                </Text>
                                            </Grid>
                                            <Grid
                                                container
                                                item
                                                xs={12}
                                                justify="space-between"
                                            >
                                                <Text
                                                    style={{
                                                        // paddingTop: "1rem",
                                                        paddingLeft: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    type="secondary"
                                                >
                                                    Shipping city
                                                </Text>
                                                <Text
                                                    style={{
                                                        // paddingTop: "1rem",
                                                        paddingRight: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    type="default"
                                                >
                                                    {firstData.shipping_city}
                                                </Text>
                                            </Grid>
                                            <Grid
                                                container
                                                item
                                                xs={12}
                                                justify="space-between"
                                            >
                                                <Text
                                                    style={{
                                                        // paddingTop: "1rem",
                                                        paddingLeft: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    type="secondary"
                                                >
                                                    Shipping country
                                                </Text>
                                                <Text
                                                    style={{
                                                        // paddingTop: "1rem",
                                                        paddingRight: "1rem",
                                                        paddingBottom: "1rem",
                                                    }}
                                                    type="default"
                                                >
                                                    {firstData.shipping_country}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12}>
                                    <Title
                                        style={{
                                            paddingTop: "1rem",
                                            paddingLeft: "2rem",
                                            paddingBottom: "1rem",
                                        }}
                                        level={4}
                                    >
                                        Items ordered
                                    </Title>
                                </Grid>
                                <MaterialTable
                                    columns={columns}
                                    data={data}
                                    title=""
                                    options={{
                                        minBodyHeight: 0,
                                        maxBodyHeight: 510,

                                        headerStyle: {
                                            backgroundColor: "#fafafa",
                                            color: "#000000d9",
                                            fontWeight: "600",
                                            whiteSpace: "nowrap",
                                            cursor: "default",
                                        },
                                        toolbar: false,
                                        sorting: false,
                                        selection: false,
                                        paging: false,
                                    }}
                                ></MaterialTable>
                            </Card>
                        </Grid>
                        <Grid item xs={4}>
                            <Card>
                                <Grid
                                    item
                                    xs={12}
                                    style={{
                                        borderBottom: "1px solid gray",
                                    }}
                                >
                                    <Title
                                        style={{
                                            paddingTop: "1rem",
                                            paddingLeft: "2rem",
                                            paddingBottom: "1rem",
                                        }}
                                        level={4}
                                    >
                                        Order summary
                                    </Title>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    xs={12}
                                    justify="space-between"
                                >
                                    <Text
                                        style={{
                                            paddingTop: "1rem",
                                            paddingLeft: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                        type="secondary"
                                    >
                                        Sub total
                                    </Text>
                                    <Text
                                        style={{
                                            paddingTop: "1rem",
                                            paddingRight: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                        type="default"
                                    >
                                        {orderAmount} $
                                    </Text>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    xs={12}
                                    justify="space-between"
                                >
                                    <Text
                                        style={{
                                            // paddingTop: "1rem",
                                            paddingLeft: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                        type="secondary"
                                    >
                                        Tax
                                    </Text>
                                    <Text
                                        style={{
                                            paddingTop: "1rem",
                                            paddingRight: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                        type="default"
                                    >
                                        0 $
                                    </Text>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    xs={12}
                                    justify="space-between"
                                    style={{
                                        borderBottom: "1px solid gray",
                                    }}
                                >
                                    <Text
                                        style={{
                                            // paddingTop: "1rem",
                                            paddingLeft: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                        type="secondary"
                                    >
                                        Shipping and handling
                                    </Text>
                                    <Text
                                        style={{
                                            paddingTop: "1rem",
                                            paddingRight: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                        type="default"
                                    >
                                        0 $
                                    </Text>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    xs={12}
                                    justify="space-between"
                                >
                                    <Title
                                        style={{
                                            paddingTop: "1rem",
                                            paddingLeft: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                        level={5}
                                    >
                                        Total paid
                                    </Title>
                                    <Title
                                        level={5}
                                        style={{
                                            // paddingTop: "0.5rem",
                                            paddingRight: "1rem",
                                            paddingBottom: "1rem",
                                        }}
                                        type="default"
                                    >
                                        {orderAmount} $
                                    </Title>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Card.Body>
            </Card>
        </>
    );
};

export default OrderDetail;

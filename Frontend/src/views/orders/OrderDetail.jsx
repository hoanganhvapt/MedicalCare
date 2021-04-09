import React, { useEffect, useState } from "react";
import {
    getCarrier,
    getDetailOrder,
    getTracking,
    getUserConfirm,
} from "./OrderService";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { Grid, Badge, AppBar, Toolbar } from "@material-ui/core";
import MaterialTable, { MTableToolbar } from "material-table";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Typography, Image, Timeline, Drawer } from "antd";
import DrawerFileDesign from "./DrawerFileDesign";
import TimelineItem from "antd/lib/timeline/TimelineItem";

const { Text, Title } = Typography;
toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const OrderDetail = (props) => {
    const { order_number } = useParams();
    const [orders, setOrders] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [firstData, setFirstData] = useState({});
    const [id, setId] = useState(null);
    const [openDesign, setOpenDesign] = useState(false);
    const [orderDesign, setOrderDesign] = useState(null);
    const [prodDesign, setProdDesign] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [orderLog, setOrderLog] = useState([]);
    const [dbId, setDbId] = useState(null);
    const [note, setNote] = useState([]);
    const updateTableData = () => {
        getDetailOrder({ id: order_number })
            .then(async (res) => {
                let result = res.data.data;
                console.log(result);
                let tmp = [];
                if (result.length === 0) return props.history.push("/orders");
                let order_items = result.order_item;
                let requestTracking = {
                    order_id: result.order_example.order_id,
                };
                await getTracking(requestTracking)
                    .then((rest) => {
                        if (rest.data.status === 404) return;
                        let track = rest.data.data;
                        if (track.tracking_number != "") {
                            result.order_example.tracking_nbr =
                                track.tracking_number;
                        }
                    })
                    .catch((err) => console.log(err));
                for (let i = 0; i < order_items.length; i++) {
                    let requeCarrier = {
                        order_id: result.order_example.order_id,
                        store_product_id: order_items[i].store_prd_id,
                    };
                    await getCarrier(requeCarrier)
                        .then((resc) => {
                            if (resc.data.status === 404) return;
                            let carriers = resc.data.data;
                            if (carriers.carrier_name !== "") {
                                order_items[i].carrier_name =
                                    carriers.carrier_name;
                            }
                            if (carriers.store_media !== "") {
                                order_items[i].store_media =
                                    carriers.store_media;
                            }
                        })
                        .catch((err) => console.log(err));

                    if (
                        typeof order_items[i].printer_design_url === "string" &&
                        order_items[i].printer_design_url != ""
                    ) {
                        order_items[i].printer_design_url = JSON.parse(
                            order_items[i].printer_design_url
                        );
                    }
                    if (
                        typeof order_items[i].prod_url_design_printer ===
                            "string" &&
                        order_items[i].prod_url_design_printer != ""
                    ) {
                        order_items[i].prod_url_design_printer = JSON.parse(
                            order_items[i].prod_url_design_printer
                        );
                    }
                    if (
                        order_items[i].store_media != "" ||
                        order_items[i].store_media.length > 0
                    ) {
                        order_items[i].store_media =
                            order_items[i].store_media[0];
                    }
                    tmp.push(result.order_item[i]);
                }
                let log_ord = result.order_example.order_logs.logs;
                for (let i = 0; i < log_ord.length; i++) {
                    let log_item = log_ord[i];
                    if ("who_confirm" in log_item) {
                        let request_user = {
                            id: log_item.who_confirm,
                        };
                        await getUserConfirm(request_user, (res_user) => {
                            if (res_user.data.status === 404) return;
                            let result_user = res_user.data.data;
                            log_ord[i].title +=
                                result_user[0].usr_first_name +
                                " " +
                                result_user[0].usr_last_name;
                        });
                    }
                }
                setOrderLog(log_ord);
                setNote(result.order_example.note);
                setOrders(tmp);
                setFirstData(result.order_example);
                handleCloseDialog();
            })
            .catch((err) => toast.error(err));
    };
    useEffect(() => {
        updateTableData();
    }, []);
    const handleCloseDialog = () => {
        setOpenDesign(false);
        setDbId(null);
        setId(null);
        setOrderDesign([]);
        setProdDesign([]);
        setOrderStatus(null);
        setPaymentStatus(null);
    };

    // const handleChnageShip = () => {
    //     setChangeShip(true);
    // };
    const handleOpenDrawerDesign = (
        db_id,
        order_id,
        order_design,
        prod_design,
        order_status,
        payment_status
    ) => {
        setOpenDesign(true);
        setDbId(db_id);
        setId(order_id);
        setOrderDesign(order_design);
        setProdDesign(prod_design);
        setOrderStatus(order_status);
        setPaymentStatus(payment_status);
    };
    // const handleCloseDialog = () => {
    //     setChangeShip(false);
    // };
    return (
        <div>
            <>
                {/* {openChangeShip &
                (
                    <>
                        <DialogChangeShip
                            close={() => handleCloseDialog()}
                            data_ex={firstData}
                            update={() => updateTableData()}
                        />
                    </>
                )} */}
                <Card>
                    <Card.Body>
                        <h3>{firstData.order_id}</h3>
                        <h6>{firstData.dtime_entered}</h6>
                    </Card.Body>
                </Card>
                <Grid container spacing={2}>
                    <Grid container item xs={8}>
                        <Card className="w-100">
                            <Card.Header>
                                <Title level={5} className="mb-0">
                                    Products
                                </Title>
                            </Card.Header>
                            <Card.Body>
                                {orders.map((item) => (
                                    <Grid container>
                                        <Grid item xs={2}>
                                            <Image
                                                width={100}
                                                src={item.store_media}
                                            />
                                        </Grid>
                                        <Grid
                                            container
                                            item
                                            xs={10}
                                            spacing={2}
                                        >
                                            <Title level={5} className="w-100">
                                                {item.product_name}
                                            </Title>
                                            <Grid item xs={5} className="">
                                                <p className="mb-0">
                                                    <b>Product Status : </b>
                                                    {item.status}
                                                </p>
                                                <hr />
                                                <p className="mb-0">
                                                    <b>Quantity : </b>
                                                    {item.quantity}
                                                </p>
                                                <hr />
                                                <p className="mb-0">
                                                    <b>Base cost : </b>$
                                                    {item.ord_price}
                                                </p>
                                            </Grid>
                                            <Grid item xs={5} className="">
                                                <p className="mb-0">
                                                    <b>Product Sku : </b>
                                                    {item.sku}
                                                </p>
                                                <hr />
                                                <p className="mb-0">
                                                    <b>Supplier : </b>
                                                    {item.sup_name}
                                                </p>
                                                <hr />
                                                <p className="mb-0">
                                                    <b>Carrier : </b>
                                                    {item.carrier_name}
                                                </p>
                                                <hr />
                                                <p className="mb-0">
                                                    <b>Tracking Nbr : </b>
                                                    {firstData.tracking_nbr}
                                                </p>
                                            </Grid>
                                            <Grid item xs={2} className="">
                                                <a
                                                    className="btn btn-link px-0"
                                                    onClick={() =>
                                                        handleOpenDrawerDesign(
                                                            item.db_id,
                                                            item.order_id,
                                                            item.printer_design_url,
                                                            item.prod_url_design_printer,
                                                            item.order_status,
                                                            item.payment_status
                                                        )
                                                    }
                                                >
                                                    View Design
                                                </a>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Card.Body>
                        </Card>
                        <Card className="w-100">
                            <Card.Header>
                                <h5>Order logs</h5>
                            </Card.Header>
                            <Card.Body>
                                <Timeline>
                                    {orderLog.map((item) => (
                                        <Timeline.Item>
                                            {item.title} {item.dtime}
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Card.Body>
                        </Card>
                    </Grid>
                    <Grid container item xs={4}>
                        <Card className="w-100">
                            <Card.Header>
                                <Title level={5} className="mb-0">
                                    Note
                                </Title>
                            </Card.Header>
                            <Card.Body>
                                {note.map((items) => (
                                    <p className="mb-1">{items}</p>
                                ))}
                            </Card.Body>
                        </Card>
                        <Card className="w-100">
                            <Card.Header>
                                <Title level={5} className="mb-0">
                                    Order information
                                </Title>
                            </Card.Header>
                            <Card.Body>
                                <table className="table table-borderless">
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Order status :
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.ord_status}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Unit Quantity :
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.quantity}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Total price :
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                ${firstData.total_price}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </Card.Body>
                        </Card>
                        <Card className="w-100">
                            <Card.Header>
                                <Title level={5} className="mb-0">
                                    Seller information
                                </Title>
                            </Card.Header>
                            <Card.Body>
                                <table className="table table-borderless">
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Seller name :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.seller_name}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Seller email :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.seller_email}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Seller level :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.seller_level}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </Card.Body>
                        </Card>
                        <Card className="w-100">
                            <Card.Header>
                                <Title level={5} className="mb-0">
                                    Store information
                                </Title>
                            </Card.Header>
                            <Card.Body>
                                <table className="table table-borderless">
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Site :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.store_name}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Platform :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.store_platform}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </Card.Body>
                        </Card>
                        <Card className="w-100">
                            <Card.Header>
                                <Title level={5} className="mb-0">
                                    Shipping information
                                </Title>
                                {/* <a
                                    className="float-right btn btn-link"
                                    onClick={() => handleChangeShip()}
                                >
                                    Edit
                                </a> */}
                            </Card.Header>
                            <Card.Body>
                                <table className="table table-borderless">
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Full name :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.shipping_name}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Email :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.shipping_email}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Phone number :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.shipping_phone}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Address :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.shipping_address1}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">Zip : </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.shipping_zip}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Province :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.shipping_province}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b className="float-left">
                                                Country :{" "}
                                            </b>
                                        </td>
                                        <td>
                                            <span className="float-right">
                                                {firstData.shipping_country}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </Card.Body>
                        </Card>
                    </Grid>
                    <Drawer
                        title="View print file design"
                        placement="right"
                        closable={true}
                        onClose={() => handleCloseDialog()}
                        visible={openDesign}
                        width="35%"
                    >
                        <DrawerFileDesign
                            id={id}
                            db_id={dbId}
                            printer_design_url={orderDesign}
                            prod_url_design_printer={prodDesign}
                            order_status={orderStatus}
                            payment_status={paymentStatus}
                            close={() => handleCloseDialog()}
                            update={() => updateTableData()}
                        />
                    </Drawer>
                    <AppBar position="sticky">
                        <Toolbar
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                            }}
                        >
                            <Button className="mr-3 mb-0" variant="secondary">
                                <ArrowBackIcon />
                                Back
                            </Button>
                        </Toolbar>
                    </AppBar>
                </Grid>
            </>
        </div>
    );
};

export default OrderDetail;

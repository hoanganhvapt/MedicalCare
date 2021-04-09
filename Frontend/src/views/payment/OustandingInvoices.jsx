import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MaterialTable, { MTableToolbar } from "material-table";
import { getUnpaidListOrder } from "./PaymentService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import PaymentIcon from "@material-ui/icons/Payment";
import StripeDialog from "./StripeDialog";
import { Drawer } from "antd";
import { CircularProgress, Grid, Tooltip } from "@material-ui/core";
import { Form, Button } from "react-bootstrap";
import {
    paymentPaypal,
    paymentStripe,
    saveCardDuringPayment,
    getCardList,
    semiPay,
} from "./PaymentService";
import Select from "react-select";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import { getCardList } from "../orders/OrderService";

toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const OutstandingInvoices = (props) => {
    const dataUser = useSelector((state) => state.user.dataUser);
    console.log(dataUser);
    const [selectedRow, setSelectedRow] = useState(null);
    const [data, setData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const [amount, setAmount] = useState(0);
    const [visible, setVisible] = useState(false);
    const [checkPay, setCheckPay] = useState(true);
    const [checkConfirm, setCheckConfirm] = useState(false);
    const [hrefPaypal, setHrefPaypal] = useState("");
    const [payment, setPayment] = useState("");
    const [openStripeDialog, setOpenStripeDialog] = useState(false);
    const [dataStripe, setDataStripe] = useState();
    const [paymentDataId, setPaymentDataId] = useState([]);
    const [savingStatus, setSavingStatus] = useState(false);
    const [checkBoxStatus, setCheckBoxStatus] = useState(false);
    const [cardOption, setCardOption] = useState([]);
    const [checkCard, setCheckCard] = useState(false);
    const [card, setCard] = useState(false);
    const [dataCard, setDataCard] = useState([]);
    const [creditCard, setCreditCard] = useState({});
    const [checkErrMsg, setCheckErrMsg] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const paymentMethod = [
        {
            label: "Paypal",
            value: "paypal",
        },
        {
            label: "Credit Card",
            value: "stripe",
        },
    ];

    const handleChangeCheckBox = (e) => {
        setSavingStatus(e.target.checked);
    };
    const handleHistory = () => {
        handleCloseDialog();
        props.history.push("/billing/transaction-history");
    };
    const handleGetCardList = () => {
        getCardList({ userId: dataUser[0].id })
            .then((res) => {
                let result = res.data.data;
                let dataArr = [];
                for (let i = 0; i < result.length; i++) {
                    let dataObj = {
                        label:
                            result[i].brand.toUpperCase() +
                            "-" +
                            result[i].last_four_number,
                        value: result[i].payment_method_id,
                    };
                    dataArr.push(dataObj);
                }
                if (dataArr.length === 0) {
                    setCheckCard(true);
                }
                setCardOption(dataArr);
                setDataCard(result);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePaypalLink = () => {
        window.location.href = hrefPaypal;
    };
    const handleSavingCard = () => {
        setSavingStatus(true);
    };
    const handleChangePayment = (e) => {
        setPayment(e.value);
        if (e.value === "stripe") {
            if (cardOption.length === 0) {
                setCheckCard(true);
            }
            setCard(true);
            setCheckBoxStatus(true);
        } else {
            setCard(false);
            setCheckCard(false);
            setCheckBoxStatus(false);
        }
    };
    const handleChangeCard = (e) => {
        setCheckErrMsg(false);
        setCard(false);
        let card = dataCard.filter(
            (item) => item.payment_method_id === e.value
        );
        let dataObj = {
            customerId: card[0].customer_id_stripe,
            paymentMethodId: card[0].payment_method_id,
        };
        setCreditCard(dataObj);
        //  setPayment(e.value);
        //  if (e.value === "stripe") {
        //      setCheckBoxStatus(true);
        //  } else {
        //      setCheckBoxStatus(false);
        //  }
    };

    const showDrawer = () => {
        setCheckBoxStatus(false);
        if (payment === "stripe") {
            setCheckBoxStatus(true);
        }
        setCheckConfirm(false);
        // setPaymentData(data);
        setVisible(true);
    };
    const closeDrawer = () => {
        setCheckPay(true);
        setVisible(false);
    };
    const handleAmount = (data) => {
        setPaymentData(data);
        let totalAmount = 0;
        let orderIdList = [];
        for (let i = 0; i < data.length; i++) {
            totalAmount += data[i].ordPrice;
            orderIdList.push(data[i].orderId);
        }
        setAmount(totalAmount);
        setPaymentDataId(orderIdList);
    };

    const columns = [
        {
            title: "Order Number",
            // field: "orderId",
            align: "left",

            cellStyle: {
                fontWeight: 600,
                color: "#f95d01",
            },
            render: (rowData) => {
                return (
                    <Link to={"/orders/" + rowData.orderId}>
                        {rowData.orderId}
                    </Link>
                );
            },
        },
        {
            title: "Payment status",
            // field: "dtime_entered",
            align: "left",
            render: (rowData) => {
                return <p>Unpaid</p>;
            },
            cellStyle: {
                fontWeight: 600,
                color: "##f101f9",
            },
        },
        {
            title: "Amount",
            // field: "ord_price",
            align: "left",
            render: (rowData) => {
                return <p>{rowData.ordPrice} $</p>;
            },
        },
        {
            title: "Received Date",
            field: "dateTimeEntered",
            align: "left",
        },
    ];

    const handleCloseDialog = () => {
        setCheckConfirm(false);
        setOpenStripeDialog(false);
    };

    const handlePaymentPaypal = () => {
        paymentPaypal(1, paymentDataId)
            .then(async (res) => {
                let href = res.data.data.redirectLink;
                setHrefPaypal(href);
                setCheckPay(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handlePaymentStripe = () => {
        let dataObj = {
            idList: paymentDataId,
            stripeCard: creditCard,
        };
        semiPay(dataUser[0].id, dataObj)
            .then((res) => {
                let result = res.data;
                if (result.status === "succeeded") {
                    toast.success("Successfully!");
                    props.history.push("/billing/transaction-history");
                } else if (result.status === "authentication_required") {
                    setDataStripe(result);
                    setOpenStripeDialog(true);
                } else if (result.status === "insufficient_funds") {
                    setCheckConfirm(false);
                    setCheckErrMsg(true);
                    setErrMsg(
                        "Your card has insufficient funds. Please choose another payment method!"
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePayment = () => {
        if (payment === "paypal") {
            setCheckBoxStatus(false);
            setCheckConfirm(true);
            handlePaymentPaypal();
        }
        if (payment === "stripe") {
            setCheckBoxStatus(true);
            setCheckConfirm(true);
            handlePaymentStripe();
            // if (savingStatus == true) {
            //     saveCardDuringPayment(1, paymentDataId)
            //         .then((res) => {
            //             setDataStripe(res.data.data);
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //         });
            //     setOpenStripeDialog(true);
            // } else {
            //     paymentStripe(1, paymentDataId)
            //         .then((res) => {
            //             setDataStripe(res.data.data);
            //         })
            //         .catch((err) => {
            //             console.log(err);
            //         });
            //     setOpenStripeDialog(true);
            // }
        }
    };

    const updateTableData = () => {
        getUnpaidListOrder(dataUser[0].id)
            .then((res) => {
                let result = res.data;
                for (let i = 0; i < result.length; i++) {
                    let tmp = result[i].dateTimeEntered.split("T");
                    result[i].dateTimeEntered = tmp[0];
                }
                setData([...result]);
            })
            .catch((err) => toast.error(err));
    };
    useEffect(() => {
        handleGetCardList();
        updateTableData();
    }, []);
    console.log(data);

    return (
        <>
            <h5>Total amount</h5>
            <h3>{amount} $</h3>
            <Grid container className="pb-2">
                <Button
                    className="mr-3"
                    size="sm"
                    variant="primary"
                    onClick={showDrawer}
                    disabled={paymentData.length === 0 ? true : false}
                >
                    <PaymentIcon />
                    Pay
                </Button>
            </Grid>
            <MaterialTable
                title=""
                columns={columns}
                data={data}
                options={{
                    maxBodyHeight: 510,
                    searchFieldAlignment: "left",
                    headerStyle: {
                        backgroundColor: "#fafafa",
                        color: "#000000d9",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        // cursor: "default",
                    },
                    rowStyle: (rowData) => ({
                        backgroundColor:
                            selectedRow === rowData.tableData.id
                                ? "#EEE"
                                : "#FFF",
                    }),
                    sorting: true,
                    selection: true,
                    paging: false,
                }}
                onSelectionChange={(rows) => handleAmount(rows)}
            />
            <Drawer
                title="Make a payment"
                placement="right"
                closable={false}
                onClose={closeDrawer}
                visible={visible}
                width="30%"
            >
                <p>
                    {paymentData.length < 2
                        ? paymentData.length + " invoice selected"
                        : paymentData.length + " invoices selected"}
                </p>

                {/* {paymentData.map((item) => (
                    <>
                        <Link to={"/orders/" + item.order_id}>
                            {item.order_id}
                        </Link>

                        <h5>{item.ord_price} $</h5>
                    </>
                ))} */}
                <h4>Total: {amount} $</h4>
                <p>Payment Method</p>
                {/* <Form.Group>
                    <Form.Label>Paypal and Stripe are available</Form.Label>
                    <Form.Control id="paymentMethod" as="select" custom>
                        <option value="paypal">&#xf1f4; Paypal</option>
                        <option value="stripe">&#xf1f5; Stripe</option>
                    </Form.Control>
                </Form.Group> */}
                <Select
                    options={paymentMethod}
                    isSearchable={true}
                    onChange={handleChangePayment}
                />
                {checkBoxStatus && checkCard === false ? (
                    <>
                        <p>Select your payment method</p>
                        <Select
                            options={cardOption}
                            isSearchable={true}
                            onChange={handleChangeCard}
                        />
                    </>
                ) : null}
                {checkBoxStatus && checkCard === true ? (
                    <>
                        <p>Your haven't add any payment methods yet!</p>
                        <Link to="/billing/payment-methods">
                            {" "}
                            Add your credit card
                        </Link>
                    </>
                ) : null}
                {checkErrMsg ? (
                    <p style={{ color: "red" }}>* {errMsg}</p>
                ) : null}

                {checkPay ? (
                    <Button
                        disabled={checkCard}
                        disabled={card}
                        onClick={handlePayment}
                        variant="primary"
                    >
                        {checkConfirm ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Pay"
                        )}
                    </Button>
                ) : (
                    <Button onClick={handlePaypalLink} variant="primary">
                        Confirm pay ${amount}
                    </Button>
                )}
            </Drawer>
            {openStripeDialog && (
                <StripeDialog
                    close={() => handleCloseDialog()}
                    refresh={() => handleHistory()}
                    data={dataStripe}
                    open={openStripeDialog}
                    // update={() => updateTableData()}
                />
            )}
        </>
    );
};

export default OutstandingInvoices;

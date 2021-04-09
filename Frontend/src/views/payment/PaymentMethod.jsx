import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { Switch, Card, Avatar, Tag } from "antd";
import {
    getSignUpPaypal,
    getSignUpStripe,
    getCardList,
    getAutoPayStatus,
    getAutoCard,
    setOffAutoPayStatus,
    setAutoPaymentStatus,
    setOffDefault,
    setDefaultCard,
} from "./PaymentService";
import { createSetupIntnent } from "./PaymentService";
import StripeDialogTest from "./StripeDialogTest";
import DeletePaymentMethodDialog from "./DeletePaymentMethodDialog";
import { useSelector } from "react-redux";
import AutoPayDialog from "./AutoPayDialog";

// import getCardList from "../orders/OrderService";

toast.configure({
    limit: 3,
    autoClose: 2500,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
    position: "top-center",
});
const { Meta } = Card;
const PaymentMethod = (props) => {
    const dataUser = useSelector((state) => state.user.dataUser);
    // const [data, setData] = useState([]);
    // const [selectedRow, setSelectedRow] = useState(null);
    const [linkPaypal, setLinkPaypal] = useState("");
    const [openStripeDialog, setOpenStripeDialog] = useState(false);
    const [dataStripe, setDataStripe] = useState();
    const [dataCard, setDataCard] = useState([]);
    const [openDeleteDialog, setopenDeleteDialog] = useState(false);
    const [dataDelete, setDataDelete] = useState("");
    const [autoPayData, setAutoPayData] = useState([]);
    const [autoPayStatus, setAutoPayStatus] = useState(false);
    const [autoCard, setAutoCard] = useState([]);
    const [firstSet, setFirstSet] = useState(false);
    const [switchDisable, setSwitchDisable] = useState(false);
    const handleSavingCard = () => {
        setOpenStripeDialog(true);
        createSetupIntnent(dataUser[0].id)
            .then((res) => {
                setDataStripe(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleOffAutoPay = () => {
        setOffAutoPayStatus({ cusId: autoPayData[0].customer_id_stripe })
            .then((res) => {
                console.log("check");
                if (res.status === 200) return toast.success("Auto-pay is off");
            })
            .catch((err) => console.log(err));
    };
    const handleSetDefaultCard = (paymentMethodId) => {
        getAutoCard({ cusId: autoPayData[0].customer_id_stripe })
            .then((res) => {
                let result = res.data.data;
                setAutoCard(res.data.data);

                if (result.length > 0) {
                    setOffDefault({
                        paymentMethodId: res.data.data[0].payment_method_id,
                    });
                }
                setDefaultCard({
                    paymentMethodId: paymentMethodId,
                })
                    .then((res) => {
                        console.log(res);
                        if (res.status === 200) {
                            handleGetCardList();
                            toast.success("Successfully!");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleOnAutoPay = () => {
        setAutoPaymentStatus({ cusId: autoPayData[0].customer_id_stripe })
            .then((res) => {
                if (res.status === 200) {
                    toast.success("Auto-pay is on");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleAutoPayStatus = () => {
        getAutoPayStatus({ userId: dataUser[0].id })
            .then((res) => {
                let result = res.data.data;
                if (result[0].auto_payment === 0) {
                    setAutoPayStatus(false);
                }
                if (result[0].auto_payment === 1) {
                    setAutoPayStatus(true);
                }
                setAutoPayData(result);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handeGetDefaultCard = () => {
        getAutoCard({ cusId: autoPayData[0].customer_id_stripe })
            .then((res) => {
                setAutoCard(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleAutoPay = () => {
        setAutoPayStatus(!autoPayStatus);
        getAutoCard({ cusId: autoPayData[0].customer_id_stripe })
            .then((res) => {
                if (res.data.data.length === 0) {
                    setFirstSet(true);
                }
                if (res.data.data.length > 0) {
                    setFirstSet(false);
                    if (autoPayStatus === true) {
                        handleOffAutoPay();
                    } else {
                        handleOnAutoPay();
                    }
                }
                // setAutoCard(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleOpenAutoPayDialog = (id) => {
        setFirstSet(true);
    };
    const handleCloseAutoPayDialog = () => {
        handleGetCardList();
        if (firstSet) {
            setAutoPayStatus(false);
        }
        handleAutoPayStatus();
        setFirstSet(false);
    };
    const handleOpenDeleteDialog = (id) => {
        setDataDelete(id);
        setopenDeleteDialog(true);
    };
    const handleCloseDeleteDialog = () => {
        handleGetCardList();
        setopenDeleteDialog(false);
    };
    const handleGetCardList = () => {
        getCardList({ userId: dataUser[0].id })
            .then((res) => {
                let result = res.data.data;
                if (result.length === 0) {
                    setSwitchDisable(true);
                    handleOffAutoPay();
                    setAutoPayStatus(false);
                }
                if (result.length > 0) setSwitchDisable(false);
                let tmpArr = [];
                for (let i = 0; i < result.length; i++) {
                    let tmpImg = "";
                    if (result[i].brand === "visa") tmpImg = "https://pro.printway.io/pwone/storage/app/photo/Visa.png";
                    if (result[i].brand === "mastercard") tmpImg = "https://pro.printway.io/pwone/storage/app/photo/MasterCard.png";
                    if (result[i].brand === "amex") tmpImg = "https://pro.printway.io/pwone/storage/app/photo/AMEX.jpg";
                    if (result[i].brand === "discover") tmpImg = "https://pro.printway.io/pwone/storage/app/photo/Discover.png";
                    if (result[i].brand === "diners") tmpImg = "https://pro.printway.io/pwone/storage/app/photo/DinnerClub.jpg";
                    if (result[i].brand === "jcb") tmpImg = "https://pro.printway.io/pwone/storage/app/photo/JCB.png";
                    if (result[i].brand === "unionpay") tmpImg = "https://pro.printway.io/pwone/storage/app/photo/UnionPay.jpg";
                    let tmpObj = {
                        ...result[i],
                        imgUrl: tmpImg,
                    };
                    tmpArr.push(tmpObj);
                }

                setDataCard(tmpArr);
            })
            .catch((err) => {
                console.log(err);
            });
        handleCloseDialog();
    };

    const handlePayment = () => {
        getSignUpPaypal({ id: dataUser[0].id })
            .then((res) => {
                let href = res.data.href;
                setLinkPaypal(href + "&displayMode=minibrowser");
            })
            .catch((err) => toast.error(err));
    };
    const handleCloseDialog = () => {
        // handeGetDefaultCard();
        setDataStripe();
        setOpenStripeDialog(false);
    };
    // const onBoardedCallback = (authCode, sharedId) => {
    //     console.log("ddavao");
    //     fetch(
    //         "http://localhost:8080/paypal/v1/" + userId + "/get-authentication",
    //         {
    //             method: "POST",
    //             headers: {
    //                 "content-type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 authCode: authCode,
    //                 sharedId: sharedId,
    //             }),
    //         }
    //     ).then((res) => {
    //         if (!res.ok) {
    //             alert("Something went wrong!");
    //         }
    //     });
    // };
    useEffect(() => {
        handleAutoPayStatus();
        handleGetCardList();
        // if (status === "done") {
        //     toast.success("Successfully");
        //     props.history.push("/billing/payment-methods");
        //     return;
        // }
    }, []);
    return (
        <>
            <Card
                title="Payment Method"
                extra={
                    <Button
                        onClick={handleSavingCard}
                        // disabled={checkSubmit}
                        variant="primary"
                    >
                        Add payment method
                    </Button>
                }
            >
                {dataCard.length === 0 ? (
                    <>
                        <Card title="You haven't set any payment methods yet!"></Card>
                    </>
                ) : (
                    <>
                        {dataCard.map((item) => (
                            <>
                                <Card
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Meta
                                        avatar={
                                            <Avatar
                                                style={{
                                                    width: "10rem",
                                                    height: "5rem",
                                                    objectFit: "scale-down",
                                                    borderRadius: "0%",
                                                }}
                                                src={item.imgUrl}
                                            />
                                        }
                                        title={item.brand.toUpperCase() + " - " + item.last_four_number}
                                        description={"Expires " + item.exp_month + "/" + item.exp_year}
                                    />
                                    {item.status_card === 1 ? (
                                        <Tag
                                            style={{
                                                position: "absolute",
                                                zIndex: 1000,
                                                top: "1.5rem",
                                                left: "20rem",
                                                color: "#fb0000",
                                            }}
                                            color="gold"
                                        >
                                            Default card
                                        </Tag>
                                    ) : null}
                                    <a
                                        onClick={() => handleOpenDeleteDialog(item.payment_method_id)}
                                        style={{
                                            position: "absolute",
                                            zIndex: 1000,
                                            top: "2rem",
                                            right: "2rem",
                                            color: "#fb0000",
                                        }}
                                    >
                                        Remove
                                    </a>
                                    {item.status_card === 0 ? (
                                        <a
                                            onClick={() => handleSetDefaultCard(item.payment_method_id)}
                                            style={{
                                                position: "absolute",
                                                zIndex: 1000,
                                                top: "4rem",
                                                right: "2rem",
                                                color: "#4c02fe",
                                            }}
                                        >
                                            Make as default
                                        </a>
                                    ) : null}
                                </Card>
                            </>
                        ))}
                    </>
                )}
            </Card>

            <Card
                title="Auto-pay"
                extra={
                    // <Button
                    //     onClick={handleSavingCard}
                    //     // disabled={checkSubmit}
                    //     variant="primary"
                    // >
                    //     Enable auto-pay
                    // </Button>
                    <Switch checked={autoPayStatus} disabled={switchDisable} onClick={handleAutoPay} />
                }
            >
                {autoPayStatus == false ? (
                    <p>
                        You have not enabled auto-pay function yet. We need this information in order to bill you automatically for each
                        order when recieved.
                    </p>
                ) : (
                    <h4 style={{ color: "Blue" }}>Auto-pay is activated!</h4>
                )}
            </Card>
            {openStripeDialog && (
                <StripeDialogTest
                    close={() => handleCloseDialog()}
                    refresh={() => handleGetCardList()}
                    data={dataStripe}
                    open={openStripeDialog}
                />
            )}
            {openDeleteDialog && (
                <DeletePaymentMethodDialog
                    close={() => handleCloseDeleteDialog()}
                    refresh={() => handleGetCardList()}
                    data={dataDelete}
                    open={openDeleteDialog}
                />
            )}
            {firstSet && autoPayStatus && (
                <AutoPayDialog
                    close={() => handleCloseAutoPayDialog()}
                    refresh={() => handleGetCardList()}
                    data={dataCard}
                    open={handleOpenAutoPayDialog}
                ></AutoPayDialog>
            )}
        </>
    );
};
export default PaymentMethod;

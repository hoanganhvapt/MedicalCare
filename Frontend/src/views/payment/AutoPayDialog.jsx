import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from "@material-ui/core";
import { toast } from "react-toastify";
import Select from "react-select";
import { Button } from "react-bootstrap";
import { setDefaultCard, setAutoPaymentStatus } from "./PaymentService";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const AutoPayDialog = (props) => {
    const { open, close, data } = props;
    const [cardOption, setCardOption] = useState([]);
    const [creditCard, setCreditCard] = useState({});

    const handleChangeCard = (e) => {
        let card = data.filter((item) => item.payment_method_id === e.value);
        let dataObj = {
            customerId: card[0].customer_id_stripe,
            paymentMethodId: card[0].payment_method_id,
        };
        setCreditCard(dataObj);
    };
    const handleConfirm = () => {
        setDefaultCard({ paymentMethodId: creditCard.paymentMethodId })
            .then((response) => {
                if (response.status === 200) {
                    setAutoPaymentStatus({ cusId: creditCard.customerId })
                        .then((response) => {
                            if (response.status === 200) {
                                toast.success("Successfully");
                                close();
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    console.log(data);
    const convertCardList = () => {
        let dataArr = [];
        for (let i = 0; i < data.length; i++) {
            let dataObj = {
                label:
                    data[i].brand.toUpperCase() +
                    "-" +
                    data[i].last_four_number,
                value: data[i].payment_method_id,
            };
            dataArr.push(dataObj);
        }
        setCardOption(dataArr);
    };

    useEffect(() => {
        convertCardList();
    }, []);
    console.log(cardOption);
    return (
        <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={close}>
            <DialogTitle>Select your card</DialogTitle>
            <DialogContent className="auto-pay-dialog">
                <Select
                    options={cardOption}
                    isSearchable={true}
                    onChange={handleChangeCard}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} size="sm" variant="primary">
                    Confirm
                </Button>
                <Button onClick={close} size="sm" variant="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AutoPayDialog;

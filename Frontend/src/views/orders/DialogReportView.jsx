import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { DndProvider } from "react-dnd";
import { Card, CardContent, Grid, CardHeader } from "@material-ui/core";
import {
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { Upload, Modal } from "antd";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { uploadAcceptConfirm, uploadDenyConfirm } from "./OrderService";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Typography, Image } from "antd";
import { deepOrange, green } from "@material-ui/core/colors";
const { Text, Title } = Typography;

toast.configure({
    limit: 3,
    position: "top-center",
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const today = new Date();
const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date + " " + time;

const DialogReportView = (props) => {
    const {
        open,
        close,
        update,
        id,
        order_reason,
        order_status,
        payment_status,
        printer_design_url,
        prod_url_design_printer,
        dtime_entered,
    } = props;

    const data = JSON.parse(order_reason);
    let title = "";
    switch (order_status) {
        case 6:
            title = "View reason cancel";
            break;
        case 8:
            title = "View reason resend";
            break;
        case 10:
            title = "View reason refund";
            break;
        case 13:
            title = "VIew reason partially refund";
            break;
    }
    const handleSubmitAccept = async () => {
        let request = {
            user_id_confirm: 5,
            order_id: id,
            order_status: order_status,
            dateTimeCreate: dateTime,
        };
        try {
            await uploadAcceptConfirm(request);
            toast.success("Successfully!");
            update();
            console.log("check");
        } catch (err) {
            return toast.error("Error: " + err);
        }
    };
    const hanldeSubmitDeny = async () => {
        let request = {
            user_id_confirm: 5,
            order_id: id,
            order_status: order_status,
            payment_status: payment_status,
            dateTimeCreate: dateTime,
            dtime_entered: dtime_entered,
            prod_design: prod_url_design_printer,
            order_design: printer_design_url,
        };
        try {
            await uploadDenyConfirm(request);
            toast.success("Successfully!");
            update();
            console.log("check");
        } catch (err) {
            return toast.error("Error: " + err);
        }
    };
    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth="xs"
                open={open}
                onClose={close}
                style={{ zIndex: 1101 }}
            >
                <ValidatorForm>
                    <DialogTitle>
                        {title} of order {id}
                    </DialogTitle>
                    <DialogContent>
                        <Text strong={true} className="w-100 d-block pb-3">
                            Reason: {data.order_reason}
                        </Text>

                        <Grid container spacing={2}>
                            {data.images.map((item) => (
                                <Grid item xs={4} container>
                                    <Image width={120} src={item} />
                                </Grid>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleSubmitAccept}
                            size="sm"
                            variant="primary"
                        >
                            Accept
                        </Button>
                        <Button
                            onClick={hanldeSubmitDeny}
                            size="sm"
                            variant="primary"
                        >
                            Decline
                        </Button>
                        <Button onClick={close} size="sm" variant="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        </>
    );
};

export default DialogReportView;

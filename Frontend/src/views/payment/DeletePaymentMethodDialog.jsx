import React from "react";
import { Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { deletePaymentMethod } from "./PaymentService";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const DeletePaymentMethodDialog = (props) => {
    const { open, close, data, refresh } = props;

    const handleDelete = () => {
        let dataObj = {
            id: data,
        };
        deletePaymentMethod(dataObj)
            .then(() => {
                toast.success("Successfully");
                close();
                refresh();
            })
            .catch((err) => toast.error("Something wrong!"));
    };

    return (
        <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={close}>
            <DialogTitle>Are you sure to delete?</DialogTitle>
            <DialogActions>
                <Button onClick={handleDelete} size="sm" variant="primary">
                    Yes
                </Button>
                <Button onClick={close} size="sm" variant="secondary">
                    No
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePaymentMethodDialog;

import React from "react";
import { Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import { Button } from "react-bootstrap";
import { deleteCategory } from "./ProductService";
import { toast } from "react-toastify";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const DialogAddNew = (props) => {
    const { open, close, type, data, update } = props;

    const handleDelete = async () => {
        if (type === "category" && data) {
            await deleteCategory({ id: data.id })
                .then((res) => {
                    update();
                    toast.success("Delete successfully!");
                })
                .catch((err) => toast.error("Something wrong!"));
        }
    };

    return (
        <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={close}>
            <DialogTitle>Are you sure to delete "{data.label}"?</DialogTitle>
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

export default DialogAddNew;

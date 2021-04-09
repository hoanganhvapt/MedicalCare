import React from "react";
import { Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteSite } from "./SiteService";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const DialogSiteDelete = (props) => {
    const { open, close, type, data, update } = props;

    const handleDelete = async () => {
        if (type === "site" && data) {
            await deleteSite({ id: data.id })
                .then((res) => {
                    update();
                    toast.success("Delete successfully!");
                })
                .catch((err) => toast.error("Something wrong!"));
        }
    };

    return (
        <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={close}>
            <DialogTitle>
                Are you sure to delete "{data.store_name}"?
            </DialogTitle>
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

export default DialogSiteDelete;

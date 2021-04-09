import React from "react";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
} from "@material-ui/core";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const DialogInstallApp = (props) => {
    const { open, close } = props;

    return (
        <Dialog maxWidth="1200" open={open} onClose={close}>
            <DialogTitle>How To Install Private App</DialogTitle>
            <DialogContent>
                <p>
                    Step 1: Click <b>Apps</b>
                </p>
                <img src="\1.jpg"></img>
                <hr />
                <p>
                    Step 2: Click <b>Manage private apps</b>
                </p>
                <img src="\2.jpg"></img>
                <hr />
                <p>
                    Step 3: Click button <b>Create new private app</b>
                </p>
                <img src="\3.jpg"></img>
                <hr />
                <p>
                    Step 4: Create a new private app name, and a developer's
                    email for emergency
                </p>
                <img src="\4.jpg"></img>
                <hr />
                <p>
                    Step 5: Click <b>Show inactive Admin API permissions</b>
                </p>
                <img src="\5.jpg"></img>
                <hr />
                <p>
                    Step 6: Change permission to <b>Read and write</b>{" "}
                </p>
                <img src="\6.jpg"></img>
                <hr />
                <p>
                    Step 7: Click button <b>Save</b> and a dialog popup click
                    button <b>Create app</b>{" "}
                </p>
                <img src="\7.jpg"></img>
                <hr />
                <p>
                    Step 8: All done! Your private app was created successfully!
                    Send us your <b>API Key</b> and <b>Password</b>
                </p>
                <img src="\8.jpg"></img>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} size="sm" variant="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogInstallApp;

import React, { useEffect, useState } from "react";
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Switch,
    Grid,
} from "@material-ui/core";
import { Button } from "react-bootstrap";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import { addNewSite, getSiteById, updateSite } from "./SiteService";
import { useSelector } from "react-redux";

toast.configure({
    limit: 3,
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

const DialogSiteAddNew = (props) => {
    const dataUser = useSelector((state) => state.user.dataUser);
    const userId = dataUser[0].id;
    const { open, close, update, id } = props;
    const [site, setSite] = useState({
        store_name: "",
        store_api_key: "",
        store_password: "",
        who_entered: "",
        dtime_entered: "",
    });
    const [disabled, setDisabled] = useState(false);

    const getDataById = async () => {
        await getSiteById({ id: id })
            .then((res) => {
                let result = res.data.data;
                setSite({
                    store_name: result.store_name,
                    store_api_key: result.store_api_key,
                    store_password: result.store_password,
                });
            })
            .catch((err) => toast.error(err));
    };

    const handleChangeStore = (value) => {
        console.log(value);
    };

    const handleChange = (e) => {
        return setSite({
            ...site,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitDialog = () => {
        let request = {
            user_id: userId,
            store_name: site.store_name,
            store_api_key: site.store_api_key,
            store_password: site.store_password,
            who_entered: userId,
            dtime_entered: dateTime,
        };

        return addNewSite(request)
            .then((res) => {
                toast.success("Successfully!");
                update();
            })
            .catch((err) => toast.error("Error: " + err));
    };

    const handleUpdate = () => {
        let request = {
            id: id,
            store_name: site.store_name,
            store_api_key: site.store_api_key,
            store_password: site.store_password,
        };
        return updateSite(request)
            .then((res) => {
                toast.success("Successfully!");
                update();
            })
            .catch((err) => toast.error("Error: " + err));
    };

    const checkValidate = () => {
        if (!site.store_name | !site.store_api_key | !site.store_password)
            return setDisabled(true);
        return setDisabled(false);
    };

    useEffect(() => {
        getDataById();
        checkValidate();
    }, [site.store_name, site.store_api_key, site.store_password]);

    return (
        <Dialog
            fullWidth={true}
            maxWidth="xs"
            open={open}
            onClose={close}
            style={{ zIndex: 1101 }}
        >
            <ValidatorForm onSubmit={handleSubmitDialog}>
                <DialogTitle>{id ? "Update " : "Add New "}</DialogTitle>
                <DialogContent>
                    <TextValidator
                        className="w-100 pb-3"
                        value={site.store_name}
                        onChange={handleChange}
                        name="store_name"
                        variant="outlined"
                        label="Site Name"
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                        size="small"
                        color="secondary"
                        required
                        autoComplete="off"
                    />
                    <TextValidator
                        className="w-100 pb-3"
                        variant="outlined"
                        label="API Key / Consumer Key"
                        name="store_api_key"
                        value={site.store_api_key}
                        onChange={handleChange}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                        size="small"
                        color="secondary"
                        required
                        autoComplete="off"
                    />
                    <TextValidator
                        className="w-100"
                        variant="outlined"
                        label="Password / Consumer Secret"
                        name="store_password"
                        value={site.store_password}
                        onChange={handleChange}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                        size="small"
                        color="secondary"
                        required
                        autoComplete="off"
                    />
                    <Grid
                        container
                        className="pt-3"
                        alignItems="center"
                        justify="space-between"
                    >
                        <RadioGroup
                            onChange={handleChangeStore}
                            name="type"
                            row
                        >
                            <FormControlLabel
                                value="shopify"
                                control={<Radio />}
                                label="Shopify"
                            />
                            <FormControlLabel
                                value="woo"
                                control={<Radio />}
                                label="WooCommerce"
                            />
                        </RadioGroup>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={id ? handleUpdate : handleSubmitDialog}
                        disabled={disabled}
                        size="sm"
                        variant="primary"
                    >
                        Save
                    </Button>
                    <Button onClick={close} size="sm" variant="secondary">
                        Close
                    </Button>
                </DialogActions>
            </ValidatorForm>
        </Dialog>
    );
};

export default DialogSiteAddNew;

import React, { useEffect, useState } from "react";
import { Radio, RadioGroup, FormControlLabel, Dialog, DialogActions, DialogContent, DialogTitle, Switch, Grid } from "@material-ui/core";
import { Button } from "react-bootstrap";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { addNewSupplier, addNewCategory, getCategoryById, updateCategory, addNewCarrier } from "./ProductService";
import { toast } from "react-toastify";

toast.configure({
    limit: 3,
    position: "top-center",
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const today = new Date();
const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date + " " + time;

const DialogAddNew = (props) => {
    const { open, close, type, update, id } = props;
    const [supplier, setSupplier] = useState({
        code: "",
        name: "",
    });
    const [category, setCategory] = useState({
        name: "",
        custom: "",
        type: "amazon",
        status: true,
    });
    const [carrier, setCarrier] = useState({
        carrierName: "",
        priority: NaN,
    });
    const [disabled, setDisabled] = useState(false);

    const handleChange = (e) => {
        if (type === "supplier")
            return setSupplier({
                ...supplier,
                [e.target.name]: e.target.value,
            });
        if (type === "carrier")
            return setCarrier({
                ...carrier,
                [e.target.name]: e.target.value,
            });
        return setCategory(
            e.target.name === "status"
                ? {
                      ...category,
                      [e.target.name]: e.target.checked,
                  }
                : {
                      ...category,
                      [e.target.name]: e.target.value,
                  }
        );
    };

    const handleSubmitDialog = () => {
        if (type === "supplier") {
            let request = {
                code: supplier.code,
                name: supplier.name,
                userId: 1,
                dateTimeCreate: dateTime,
            };
            return addNewSupplier(request)
                .then((res) => {
                    toast.success("Successfully!");
                    update();
                })
                .catch((err) => toast.error("Error: " + err));
        }
        if (type === "carrier") {
            let request = {
                name: carrier.carrierName,
                priority: carrier.priority,
                des: "",
                website: "",
                countryCode: "",
            };
            return addNewCarrier(request)
                .then((res) => {
                    toast.success("Successfully!");
                    update();
                })
                .catch((err) => toast.error("Error: " + err));
        }
        let request = {
            name: category.name,
            type: category.type,
            status: category.status ? 1 : 0,
            userCreate: "HAnh",
            dateTimeCreate: dateTime,
            custom: category.type === "amazon" ? category.custom : "json_shopify",
        };
        return addNewCategory(request)
            .then((res) => {
                toast.success("Successfully!");
                update();
            })
            .catch((err) => toast.error("Error: " + err));
    };

    const handleUpdate = () => {
        let request = {
            id: id,
            name: category.name,
            custom: category.custom,
            type: category.type,
            status: category.status ? 1 : 0,
        };
        return updateCategory(request)
            .then((res) => {
                toast.success("Successfully!");
                update();
            })
            .catch((err) => toast.error("Error: " + err));
    };

    const getDataById = async () => {
        if (type === "category" && id) {
            await getCategoryById({ id: id })
                .then((res) => {
                    let result = res.data.data;
                    setCategory({
                        name: result.label,
                        type: result.type,
                        custom: result.custom,
                        status: result.status === 1 ? true : false,
                    });
                })
                .catch((err) => toast.error(err));
        }
    };

    const checkValidate = () => {
        if (type === "supplier") {
            if (!supplier.code | !supplier.name) return setDisabled(true);
            return setDisabled(false);
        }
        if (type === "category") {
            if (!category.name | !category.custom) return setDisabled(true);
            return setDisabled(false);
        }
        if (type === "carrier") {
            if (!carrier.carrierName | !carrier.priority) return setDisabled(true);
            return setDisabled(false);
        }
    };

    useEffect(() => {
        getDataById();
    }, []);
    useEffect(() => {
        checkValidate();
    }, [supplier.code, supplier.name, category.name, category.custom, carrier.carrierName, carrier.priority]);

    return (
        <>
            <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={close} style={{ zIndex: 1101 }}>
                <ValidatorForm onSubmit={handleSubmitDialog}>
                    <DialogTitle>
                        {id ? "Update " : "Add new "}
                        {type}
                    </DialogTitle>
                    <DialogContent>
                        {type === "supplier" ? (
                            <>
                                <TextValidator
                                    className="w-100 pb-3"
                                    value={supplier.code}
                                    onChange={handleChange}
                                    name="code"
                                    variant="outlined"
                                    label="Supplier code"
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                    size="small"
                                    color="secondary"
                                    required
                                    autoComplete="off"
                                />
                                <TextValidator
                                    className="w-100"
                                    value={supplier.name}
                                    variant="outlined"
                                    onChange={handleChange}
                                    name="name"
                                    label="Supplier name"
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                    size="small"
                                    color="secondary"
                                    required
                                    autoComplete="off"
                                />
                            </>
                        ) : (
                            <>
                                {type === "category" ? (
                                    <>
                                        <TextValidator
                                            className="w-100 pb-3"
                                            variant="outlined"
                                            label="Category name"
                                            name="name"
                                            value={category.name}
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
                                            label="Custom template"
                                            name="custom"
                                            value={category.custom}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                            size="small"
                                            color="secondary"
                                            required
                                            autoComplete="off"
                                        />
                                        <Grid container className="pt-3" alignItems="center" justify="space-between">
                                            <RadioGroup value={category.type} onChange={handleChange} name="type" row>
                                                <FormControlLabel value="amazon" control={<Radio />} label="Amazon" />
                                                <FormControlLabel value="shopify" control={<Radio />} label="Shopify" />
                                            </RadioGroup>
                                            <FormControlLabel
                                                control={<Switch checked={category.status} onChange={handleChange} name="status" />}
                                                label="Active"
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <TextValidator
                                            className="w-100 pb-3"
                                            variant="outlined"
                                            label="Carrier name"
                                            name="carrierName"
                                            value={carrier.carrierName}
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
                                            label="Priority"
                                            name="priority"
                                            type="number"
                                            value={carrier.priority}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                            size="small"
                                            color="secondary"
                                            required
                                            autoComplete="off"
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={id ? handleUpdate : handleSubmitDialog} disabled={disabled} size="sm" variant="primary">
                            Save
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

export default DialogAddNew;

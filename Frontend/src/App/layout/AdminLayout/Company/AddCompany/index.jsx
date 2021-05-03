import React, { useContext, useState } from "react";
import Container from "@material-ui/core/Container";
import useForm from "react-hooks-form-validator";
import { Button } from "@material-ui/core";
import { Form } from "antd";
import TextField from "@material-ui/core/TextField";
import { multiStepContext } from "./StepContext";

const FormItem = Form.Item;

const formConfig = {
    companyname: {
        required: true,
        min: 1,
        patterns: [
            {
                regex: new RegExp(/^[a-zA-Z]*$/),
                errorMsg: "Please enter a only character",
            },
        ],
    },
    address: {
        required: true,
        min: 10,
        patterns: [
            {
                regex: new RegExp(/^[a-zA-Z0-9]*$/),
                errorMsg: "Please enter a only alpha numeric address",
            },
        ],
    },
    phone: {
        required: true,
        patterns: [
            {
                regex: new RegExp(/^(84|0[3|5|7|8|9])+([0-9]{8})\b*$/),
                errorMsg: "Please enter a only numeric",
            },
        ],
    },
    url: {
        required: true,
        patterns: [
            {
                regex: new RegExp(
                    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/
                ),
                errorMsg: "Please enter a only alpha numeric",
            },
        ],
    },
};

function AddCompany() {
    const [fields, formData] = useForm(formConfig);

    return (
        <Container maxWidth={"xs"}>
            <form>
                <FormItem
                    help={fields.companyname.errorMsg}
                    required
                    hasFeedback
                >
                    <TextField
                        name="companyname"
                        label="First Name"
                        id="companyname"
                        // value={userData["companyname"]}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(event) => {
                            fields.companyname.setValue(event.target.value);
                        }}
                        value={fields.companyname.value}
                        hasFeedback
                    ></TextField>
                </FormItem>
                <FormItem help={fields.address.errorMsg} required hasFeedback>
                    <TextField
                        name="address"
                        label="Address"
                        id="address"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(event) =>
                            fields.address.setValue(event.target.value)
                        }
                        value={fields.address.value}
                        hasFeedback
                    ></TextField>
                </FormItem>
                <FormItem help={fields.phone.errorMsg} required hasFeedback>
                    <TextField
                        name="phone"
                        label="User Name"
                        id="phone"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter your phone"
                        onChange={(event) =>
                            fields.phone.setValue(event.target.value)
                        }
                        value={fields.phone.value}
                        hasFeedback
                    ></TextField>
                </FormItem>
                <FormItem help={fields.url.errorMsg} required hasFeedback>
                    <TextField
                        name="url"
                        label="Website Company"
                        id="url"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(event) =>
                            fields.url.setValue(event.target.value)
                        }
                        value={fields.url.value}
                        hasFeedback
                    ></TextField>
                </FormItem>
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    style={{ margin: "1rem 0" }}
                    onClick={() => setStep(2)}
                    disabled={!formData.isValid}
                    block
                >
                    Next
                </Button>
            </form>
        </Container>
    );
}

export default AddCompany;

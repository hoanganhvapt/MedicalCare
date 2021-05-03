// import React, { useContext } from "react";
// import Container from "@material-ui/core/Container";
// import TextField from "@material-ui/core/TextField";
// import { Button } from "@material-ui/core";
// import { multiStepContext } from "./StepContext";
// import { ErrorMessage } from "@hookform/error-message";
// import { useFormContext } from "react-hook-form";
// import { useForm } from "react-hook-form";

// const Names = () => {
//     const {
//         register,
//         handleSubmit,
//         setError,
//         formState: { errors },
//     } = useForm({
//         criteriaMode: "all",
//     });
//     // const { register, errors } = useFormContext();
//     const { setStep, userData, setUserData, submitData } = useContext(
//         multiStepContext
//     );
//     return (
//         <Container maxWidth={"xs"}>
//             <TextField
//                 name="firstName"
//                 label="First Name"
//                 value={userData["firstName"]}
//                 onChange={(e) =>
//                     setUserData({
//                         ...userData,
//                         firstName: e.target.value,
//                     })
//                 }
//                 margin="normal"
//                 variant="outlined"
//                 fullWidth
//             ></TextField>

//             <TextField
//                 name="lastName"
//                 label="Last Name"
//                 value={userData["lastName"]}
//                 // {...register("lastName", {
//                 //     required: "This is required.",
//                 //     pattern: {
//                 //         value: /^[0-9]+$/,
//                 //         message: "This input is number only.",
//                 //     },
//                 //     maxLength: {
//                 //         value: 10,
//                 //         message: "This input exceed maxLength.",
//                 //     },
//                 // })}
//                 {...register("lastName", {
//                     required: true,
//                 })}
//                 onChange={(e) =>
//                     setUserData({
//                         ...userData,
//                         lastName: e.target.value,
//                     })
//                 }
//                 margin="normal"
//                 variant="outlined"
//                 fullWidth
//             ></TextField>
//             {errors.lastName && <span>This field is required</span>}

//             <TextField
//                 name="userName"
//                 label="UserName"
//                 value={userData["userName"]}
//                 onChange={(e) =>
//                     setUserData({
//                         ...userData,
//                         userName: e.target.value,
//                     })
//                 }
//                 margin="normal"
//                 variant="outlined"
//                 fullWidth
//             ></TextField>
//             <TextField
//                 name="password"
//                 label="Password"
//                 value={userData["password"]}
//                 onChange={(e) =>
//                     setUserData({
//                         ...userData,
//                         password: e.target.value,
//                     })
//                 }
//                 margin="normal"
//                 variant="outlined"
//                 fullWidth
//             ></TextField>
//             <Button
//                 variant="contained"
//                 fullWidth
//                 type="submit"
//                 color="primary"
//                 style={{ margin: "1rem 0" }}
//                 onClick={() => setStep(2)}
//             >
//                 Next
//             </Button>
//         </Container>
//     );
// };

// export default Names;

import React, { useContext, useState } from "react";
import Container from "@material-ui/core/Container";
import useForm from "react-hooks-form-validator";
import { Button } from "@material-ui/core";
import { Form, Input } from "antd";
import TextField from "@material-ui/core/TextField";
import { multiStepContext } from "./StepContext";

const FormItem = Form.Item;

const formConfig = {
    firstname: {
        required: true,
        min: 1,
        patterns: [
            {
                regex: new RegExp(/^[a-zA-Z]*$/),
                errorMsg: "Please enter a only character",
            },
        ],
    },
    lastname: {
        required: true,
        min: 1,
        patterns: [
            {
                regex: new RegExp(/^[a-zA-Z]*$/),
                errorMsg: "Please enter a only character",
            },
        ],
    },
    username: {
        required: true,
        min: 6,
        patterns: [
            {
                regex: new RegExp(/^[a-zA-Z0-9]*$/),
                errorMsg: "Please enter a only alpha numeric username",
            },
        ],
    },
    password: {
        min: 8,
        required: true,
    },
};

function Names() {
    const [fields, formData] = useForm(formConfig);
    const { setStep, userData, setUserData, submitData } = useContext(
        multiStepContext
    );
    function handleLogin() {
        console.log({
            firstname: fields.firstname.value,
            lastname: fields.lastname.value,
            username: fields.username.value,
            password: fields.password.value,
        });
    }
    const [firstname, setFirstName] = useState("");

    return (
        <Container maxWidth={"xs"}>
            <form>
                <FormItem help={fields.firstname.errorMsg} required hasFeedback>
                    <TextField
                        name="firstname"
                        label="First Name"
                        id="firstname"
                        // value={userData["firstname"]}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(event) => {
                            setFirstName(
                                fields.firstname.setValue(event.target.value)
                            );
                        }}
                        value={fields.firstname.value}
                        hasFeedback
                    ></TextField>
                </FormItem>
                <FormItem help={fields.lastname.errorMsg} required hasFeedback>
                    <TextField
                        name="lastname"
                        label="Last Name"
                        id="lastname"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(event) =>
                            fields.lastname.setValue(event.target.value)
                        }
                        value={fields.lastname.value}
                        hasFeedback
                    ></TextField>
                </FormItem>
                <FormItem help={fields.username.errorMsg} required hasFeedback>
                    <TextField
                        name="username"
                        label="User Name"
                        id="username"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        placeholder="Enter your UserName"
                        onChange={(event) =>
                            fields.username.setValue(event.target.value)
                        }
                        value={fields.username.value}
                        hasFeedback
                    ></TextField>
                </FormItem>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Please input your username!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <FormItem help={fields.password.errorMsg} required hasFeedback>
                    <TextField
                        name="password"
                        label="Password"
                        id="password"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(event) =>
                            fields.password.setValue(event.target.value)
                        }
                        value={fields.password.value}
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

export default Names;

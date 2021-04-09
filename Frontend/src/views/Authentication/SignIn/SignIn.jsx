import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import "./../../../assets/scss/style.scss";
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
import { Button } from "react-bootstrap";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { CircularProgress, Grid, InputAdornment } from "@material-ui/core";
import { Login } from "./SignInService";
import Swal from "sweetalert2";

const SignIn = (props) => {
    const [formSignIn, setFormSignIn] = useState({
        usr_email: "",
        usr_pwd: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        Login({ usr_email: formSignIn.usr_email, usr_pwd: formSignIn.usr_pwd })
            .then((res) => {
                console.log(res);
                let result = res.data.data;
                if (result.status === 404)
                    return setTimeout(async () => {
                        setLoading(false);
                        await Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Email doesn't exist!",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    }, 1500);
                if (result.status === 400)
                    return setTimeout(async () => {
                        setLoading(false);
                        await Swal.fire({
                            position: "center",
                            icon: "error",
                            title: "Wrong email/password combination!",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    }, 1500);
                if (result.status === 200)
                    return setTimeout(async () => {
                        setLoading(false);
                        await Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Login successfully!",
                            showConfirmButton: false,
                            timer: 2000,
                            iconColor: "#ff5f02",
                        });
                        props.history.push("/");
                    }, 1500);
            })
            .catch((err) => console.log(err));
    };

    const handleChange = (e) => {
        setFormSignIn({
            ...formSignIn,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        document.title = "Login | Prinway";
    }, []);
    return (
        <Aux>
            {loading ? (
                <div
                    style={{
                        position: "fixed",
                        zIndex: 999999,
                        width: "100%",
                        height: "100vh",
                        backgroundColor: "#00000047",
                        top: 0,
                        left: 0,
                    }}
                >
                    <CircularProgress
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            color: "#ff5f02",
                        }}
                    />
                </div>
            ) : null}

            <ValidatorForm onSubmit={handleSubmit}>
                <Breadcrumb />
                <div className="auth-wrapper">
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r" />
                            <span className="r s" />
                            <span className="r s" />
                            <span className="r" />
                        </div>
                        <div className="card">
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <img width="250" src="/logo_dark.png"></img>
                                </div>
                                <h3 className="mb-4">Login</h3>
                                <TextValidator
                                    className="w-100 mb-3"
                                    value={formSignIn.usr_email}
                                    onChange={handleChange}
                                    name="usr_email"
                                    type="email"
                                    variant="outlined"
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon
                                                    style={{
                                                        color: "#717171de",
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    size="small"
                                    color="secondary"
                                    required
                                    autoComplete="off"
                                />
                                <TextValidator
                                    className="w-100 mb-4"
                                    value={formSignIn.usr_pwd}
                                    onChange={handleChange}
                                    name="usr_pwd"
                                    type="password"
                                    variant="outlined"
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOpenIcon
                                                    style={{
                                                        color: "#717171de",
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    }}
                                    size="small"
                                    color="secondary"
                                    required
                                    autoComplete="off"
                                />
                                <Grid container className="mb-2" justify="center">
                                    <Button
                                        className="w-100"
                                        type="submit"
                                        variant="primary"
                                        size="md"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            marginRight: 0,
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Grid>
                                <p className="mb-2 text-muted">
                                    Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ValidatorForm>
        </Aux>
    );
};

export default SignIn;

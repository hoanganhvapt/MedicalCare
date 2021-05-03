import React, { useState } from "react";
import emailjs from "emailjs-com";
import { Form, Input, Button, Checkbox } from "antd";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";

const FormSignup = () => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };
    function sendEmail(e) {
        e.preventDefault();
        setLoading(true);
        emailjs
            .sendForm(
                "service_he3qlfx",
                "template_email",
                e.target,
                "user_Dt23de8p1Hx2z3C1ppoLN"
            )
            .then(
                (result) => {
                    e.target.reset();
                },
                (error) => {
                    console.log(error.text);
                }
            );
        
    }

    return (
        <div className="form-content-right">
            <form onSubmit={sendEmail} className="form">
                <p style={{ color: "white", fontSize: "28px" }}>FeedBack</p>
                <div className="form-inputs">
                    <input
                        className="form-control"
                        type="text"
                        name="username"
                        placeholder="Name"
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                        value={values.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-inputs">
                    <input
                        className="form-control"
                        type="email"
                        name="email"
                        placeholder="Email"
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                        value={values.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-inputs">
                    <input
                        className="form-input"
                        type="text"
                        className="form-control"
                        placeholder="Subject"
                        name="subject"
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                        placeholder="Subject"
                        value={values.subject}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-inputs">
                    <textarea
                        className="form-control"
                        id=""
                        cols="30"
                        rows="8"
                        placeholder="Message"
                        name="message"
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                        value={values.message}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <input
                    type="submit"
                    className="form-input-btn"
                    value="Send Message"
                ></input>
            </form>
        </div>
    );
};

export default FormSignup;

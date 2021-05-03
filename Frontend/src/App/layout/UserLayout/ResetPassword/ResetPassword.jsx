import React, { useState } from "react";
import emailjs from "emailjs-com";
const ContactForm = (props) => {
    const [random, setRandom] = useState();
    function sendEmail(e) {
        e.preventDefault();

        emailjs
            .sendForm(
                "service_he3qlfx",
                "template_g0ewt9k",
                e.target,
                "user_Dt23de8p1Hx2z3C1ppoLN"
            )
            .then(
                (result) => {
                    console.log(result.text);
                },
                (error) => {
                    console.log(error.text);
                }
            );
        e.target.reset();
    }

    return (
        <>
            <div className="container">
                <form onSubmit={sendEmail}>
                    <div className="row pt-5 mb-5 mx-auto">
                        <div className="col-8 form-group pt-2 mx-auto">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email Address"
                                name="email"
                            />
                        </div>
                        <div className="col-8 pt-3 mx-auto">
                            <input
                                type="submit"
                                className="btn btn-info"
                                value="Reset Password"
                                onClick={handleClick}
                            >
                                <a href="https://mail.google.com/"></a>
                            </input>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ContactForm;

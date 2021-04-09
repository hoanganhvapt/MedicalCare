import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { paymentPaypal, paymentStripe } from "./PaymentService";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const promise = loadStripe(
    "pk_test_51ID7IEDcTnMJlyZx39Zsw3MQB40CHPi2PNlxyKuK20S0WHoTb33VHRjeQGQFmqIiIPqlkfm6LLX8bntx8CyL0RCf00Dr6ilc7M"
);
const PaymentDialog = (props) => {
    const { open, close, data } = props;
    const [checkStripeForm, setCheckStripeForm] = useState(false);
    const StripeFormCard = () => {
        const CheckoutForm = () => {
            const [succeeded, setSucceeded] = useState(false);
            const [error, setError] = useState(null);
            const [processing, setProcessing] = useState("");
            const [disabled, setDisabled] = useState(true);
            const [clientSecret, setClientSecret] = useState("");
            const [tranToken, setTranToken] = useState("");
            const [payToken, setPayToken] = useState("");
            const stripe = useStripe();
            const elements = useElements();
            useEffect(() => {
                paymentStripe(1, data)
                    .then((res) => {
                        let clientSecret = res.data.clientSecret;
                        setClientSecret(clientSecret);
                        setPayToken(res.data.paymentIntentId);
                        setTranToken(res.data.transactionId);
                        console.log(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                // Create PaymentIntent as soon as the page loads
                // window
                //     .fetch("/create-payment-intent", {
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/json",
                //         },
                //         body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
                //     })
                //     .then((res) => {
                //         return res.json();
                //     })
                //     .then((data) => {
                //         setClientSecret(data.clientSecret);
                //     });
            }, []);
            const cardStyle = {
                style: {
                    base: {
                        color: "#32325d",
                        fontFamily: "Arial, sans-serif",
                        fontSmoothing: "antialiased",
                        fontSize: "16px",
                        "::placeholder": {
                            color: "#32325d",
                        },
                    },
                    invalid: {
                        color: "#fa755a",
                        iconColor: "#fa755a",
                    },
                },
            };
            const handleChange = async (event) => {
                // Listen for changes in the CardElement
                // and display any errors as the customer types their card details
                setDisabled(event.empty);
                setError(event.error ? event.error.message : "");
            };
            const handleSubmit = async (ev) => {
                ev.preventDefault();
                setProcessing(true);
                const payload = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                });
                if (payload.error) {
                    setError(`Payment failed ${payload.error.message}`);
                    setProcessing(false);
                } else {
                    setError(null);
                    setProcessing(false);
                    setSucceeded(true);
                    window.location.href =
                        "http://192.168.1.48:8080/callback-stripe/" +
                        payToken +
                        "/" +
                        tranToken;
                }
            };
            return (
                <form id="payment-form" onSubmit={handleSubmit}>
                    <CardElement
                        id="card-element"
                        options={cardStyle}
                        onChange={handleChange}
                    />
                    <button
                        disabled={processing || disabled || succeeded}
                        id="submit"
                    >
                        <span id="button-text">
                            {processing ? (
                                <div className="spinner" id="spinner"></div>
                            ) : (
                                "Pay now"
                            )}
                        </span>
                    </button>
                    {/* Show any error that happens when processing the payment */}
                    {error && (
                        <div className="card-error" role="alert">
                            {error}
                        </div>
                    )}
                    {/* Show a success message upon completion */}
                </form>
            );
        };
        return (
            <div className="App">
                <Elements stripe={promise}>
                    <CheckoutForm />
                </Elements>
            </div>
        );
    };

    const handlePaymentPaypal = () => {
        console.log(data);
        paymentPaypal(1, data)
            .then((res) => {
                console.log(res);
                let href = res.data.data.redirectLink;
                window.location.href = href;
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handlePaymentStripe = () => {
        setCheckStripeForm(true);
        // paymentStripe(1, data);
    };

    return (
        <Dialog fullWidth={true} maxWidth="xs" open={open} onClose={close}>
            <DialogTitle>Select your payment method</DialogTitle>
            <DialogContent>
                {checkStripeForm === true && <StripeFormCard />}
            </DialogContent>
            <DialogActions>
                {/* <App></App> */}
                <Button
                    onClick={handlePaymentPaypal}
                    size="sm"
                    variant="primary"
                >
                    Paypal
                </Button>
                <Button
                    onClick={handlePaymentStripe}
                    size="sm"
                    variant="primary"
                    disabled={checkStripeForm ? true : false}
                >
                    Stripe
                </Button>
                <Button onClick={close} size="sm" variant="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentDialog;

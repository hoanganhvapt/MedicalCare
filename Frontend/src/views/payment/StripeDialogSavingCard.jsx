import React, { useState, useEffect } from "react";
import {
    CardHeader,
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
import Card from "@material-ui/core/Card";

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
const StripeDialogSavingCard = (props) => {
    const { open, close, data } = props;
    const [checkStripeForm, setCheckStripeForm] = useState(false);
    const [cusToken, setCusToken] = useState("");

    const CheckoutForm = () => {
        const [succeeded, setSucceeded] = useState(false);
        const [error, setError] = useState(null);
        const [processing, setProcessing] = useState("");
        const [disabled, setDisabled] = useState(true);
        const [clientSecret, setClientSecret] = useState("");
        const stripe = useStripe();
        const elements = useElements();
        useEffect(() => {
            setClientSecret(data.clientSecret);
            setCusToken(data.customerId);
            console.log(data);
        }, [data]);
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
        const handleChange = (event) => {
            // Listen for changes in the CardElement
            // and display any errors as the customer types their card details
            setDisabled(event.empty);
            setError(event.error ? event.error.message : "");
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
            setProcessing(true);
            const payload = await stripe.confirmCardSetup(clientSecret, {
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
                console.log("DOne");
                window.location.href =
                    "http://192.168.1.48:8080/callback-setup-intent/" +
                    cusToken;
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
                    type="submit"
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
        <Dialog
            fullWidth={true}
            maxWidth="xs"
            open={data ? open : false}
            onClose={close}
        >
            <DialogTitle>Add payment method</DialogTitle>
            <DialogContent>
                <div className="App">
                    <Elements stripe={promise}>
                        <CheckoutForm />
                    </Elements>
                </div>
                <Card>
                    <CardHeader>Billing address</CardHeader>
                </Card>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} size="sm" variant="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StripeDialogSavingCard;

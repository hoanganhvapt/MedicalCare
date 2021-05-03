import React, { useContext } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import { multiStepContext } from "./StepContext";

function Address() {
    const { setStep, userData, setUserData } = useContext(multiStepContext);

    return (
        <Container maxWidth={"xs"}>
            <TextField
                name="address"
                label="Address"
                value={userData["address"]}
                onChange={(e) =>
                    setUserData({
                        ...userData,
                        address: e.target.value,
                    })
                }
                margin="normal"
                variant="outlined"
                fullWidth
            ></TextField>
            <TextField
                name="state"
                label="State"
                value={userData["state"]}
                onChange={(e) =>
                    setUserData({
                        ...userData,
                        state: e.target.value,
                    })
                }
                margin="normal"
                variant="outlined"
                fullWidth
            ></TextField>
            <TextField
                name="country"
                label="Country"
                value={userData["country"]}
                onChange={(e) =>
                    setUserData({
                        ...userData,
                        country: e.target.value,
                    })
                }
                margin="normal"
                variant="outlined"
                fullWidth
            ></TextField>
            <TextField
                name="city"
                label="City"
                value={userData["city"]}
                onChange={(e) =>
                    setUserData({
                        ...userData,
                        city: e.target.value,
                    })
                }
                margin="normal"
                variant="outlined"
                fullWidth
            ></TextField>
            <div style={{ margin: "1rem 0" }}>
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginRight: "1rem" }}
                    onClick={() => setStep(1)}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setStep(3)}
                >
                    Next
                </Button>
            </div>
        </Container>
    );
}

export default Address;

import { Container, Step, StepLabel, Stepper } from "@material-ui/core";
import React from "react";
import Address from "./stepForm/Address";
import Job from "./stepForm/Job";
import Names from "./stepForm/Names";
import { multiStepContext } from "./stepForm/StepContext";
import DisplayEmp from "./displayEmp/DisplayEmp";

function EmpRegister() {
    const { currentStep, finalData } = React.useContext(multiStepContext);
    function showStep(step) {
        switch (step) {
            case 1:
                return <Names />;
            case 2:
                return <Address />;
            case 3:
                return <Job />;
        }
    }
    return (
        <>
            <Container maxWidth="xs">
                <Stepper
                    style={{ backgroundColor: "#f4f7fa" }}
                    activeStep={currentStep - 1}
                    orientation="horizontal"
                >
                    <Step>
                        <StepLabel>Names</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Address</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Job</StepLabel>
                    </Step>
                </Stepper>
                {showStep(currentStep)}
            </Container>
            {finalData.length > 0 ? <DisplayEmp /> : ""}
        </>
    );
}

export default EmpRegister;

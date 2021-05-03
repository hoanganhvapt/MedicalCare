import React, { useState, createContext } from "react";
import EmpRegister from "../index";
import { Redirect } from "react-router-dom";

export const multiStepContext = createContext();
const StepContext = () => {
    const [currentStep, setStep] = useState(1);
    const [userData, setUserData] = useState([]);
    const [finalData, setFinalData] = useState([]);

    const submitData = (data) => {
        setFinalData((finalData) => [...finalData, userData]);
        setUserData("");
        setStep(1);
        // <Redirect to="http://localhost:3000/admin/employee-details" />;
    };

    return (
        <div>
            <multiStepContext.Provider
                value={{
                    currentStep,
                    setStep,
                    userData,
                    setUserData,
                    finalData,
                    setFinalData,
                    submitData,
                }}
            >
                <EmpRegister />
            </multiStepContext.Provider>
        </div>
    );
};

export default StepContext;

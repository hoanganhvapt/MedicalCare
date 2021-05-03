import React, { useContext } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { multiStepContext } from "./StepContext";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

function Job() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        criteriaMode: "all",
    });

    const { setStep, userData, setUserData, submitData } = useContext(
        multiStepContext
    );

    return (
        <Container maxWidth={"xs"}>
            <form onSubmit={handleSubmit(submitData)}>
                <TextField
                    value={userData["contactNo"]}
                    {...register("contactNo", {
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "This input is number only.",
                        },
                        maxLength: {
                            value: 10,
                            message: "This input exceed maxLength.",
                        },
                        multirequired: "This is required.",
                    })}
                    onChange={(e) => {
                        setUserData({ ...userData, contactNo: e.target.value });
                    }}
                    name="contatNo"
                    label="Contact No"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                ></TextField>
                <ErrorMessage
                    errors={errors}
                    name="contactNo"
                    render={({ message }) => <p>{message}</p>}
                />
                <FormControl margin="normal" variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">
                        Designation
                    </InputLabel>
                    <Select
                        id="demo-simple-select-outlined"
                        labelId="demo-simple-select-outlined-label"
                        name="designation"
                        label="Designation"
                        value={userData["designation"]}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                designation: e.target.value,
                            })
                        }
                    >
                        <MenuItem value={"CEO"}>CEO</MenuItem>
                        <MenuItem value={"Project_Leader"}>
                            Project Leader
                        </MenuItem>
                        <MenuItem value={"Sortware_Programmer"}>
                            Sortware Programmer
                        </MenuItem>
                        <MenuItem value={"Doctor"}>Doctor</MenuItem>
                        <MenuItem value={"Hardware"}>Hardware</MenuItem>
                        <MenuItem value={"President"}>President</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    name="joinDate"
                    label="Join Date"
                    value={userData["joinDate"]}
                    onChange={(e) =>
                        setUserData({
                            ...userData,
                            joinDate: e.target.value,
                        })
                    }
                    type="date"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                ></TextField>
                <TextField
                    name="salary"
                    label="Salary"
                    value={userData["salary"]}
                    onChange={(e) =>
                        setUserData({
                            ...userData,
                            salary: e.target.value,
                        })
                    }
                    type="number"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                ></TextField>
                <div style={{ margin: "1rem 0" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginRight: "1rem" }}
                        onClick={() => setStep(2)}
                    >
                        Back
                    </Button>
                    <span> </span>
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </form>
        </Container>
    );
}

export default Job;

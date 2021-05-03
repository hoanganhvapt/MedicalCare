import React, { useContext } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { multiStepContext } from "../stepForm/StepContext";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

function DisplayEmp() {
    const { finalData } = useContext(multiStepContext);
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Full&nbsp;Name</StyledTableCell>
                        <StyledTableCell align="right">
                            User&nbsp;Name
                        </StyledTableCell>
                        <StyledTableCell align="right">Address</StyledTableCell>
                        <StyledTableCell align="right">State</StyledTableCell>
                        <StyledTableCell align="right">Country</StyledTableCell>
                        <StyledTableCell align="right">City</StyledTableCell>
                        <StyledTableCell align="right">
                            Context No
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            Designation
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            Join Date
                        </StyledTableCell>
                        <StyledTableCell align="right">Salary</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {finalData.map((data) => (
                        <StyledTableRow key={data.contactNo}>
                            <StyledTableCell component="th" scope="row">
                                {data.firstName} {data.lastName}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.userName}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.address}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.state}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.country}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.city}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.contactNo}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.designation}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.joinDate}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {data.salary}
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default DisplayEmp;

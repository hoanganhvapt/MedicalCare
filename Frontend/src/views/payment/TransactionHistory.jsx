import React, { useEffect, useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { getPaidListOrder } from "./PaymentService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const TransactionHistory = (props) => {
    const dataUser = useSelector((state) => state.user.dataUser);
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const columns = [
        {
            title: "Order Number",
            field: "order_id",
            align: "center",

            cellStyle: {
                fontWeight: 600,
                color: "#f95d01",
            },
            render: (rowData) => {
                return (
                    <Link to={"/billing/" + rowData.orderId}>
                        {"#" + rowData.orderId}
                    </Link>
                );
            },
        },
        {
            title: "Payment status",
            // field: "dtime_entered",
            align: "left",
            render: (rowData) => {
                let status_payment = "";
                let paymentStatus = rowData.paymentStatus;
                switch (paymentStatus) {
                    case 0:
                        status_payment = "Unpaid";
                        break;
                    case 1:
                        status_payment = "Partially Paid";
                        break;
                    case 2:
                        status_payment = "Whitelist";
                        break;
                    case 3:
                        status_payment = "Paid";
                        break;
                }
                return (
                    <>
                        <h6
                            style={{
                                color: "blue",
                            }}
                        >
                            {status_payment}
                        </h6>
                    </>
                );
            },
        },
        {
            title: "Amount",
            // field: "ord_price",
            align: "left",
            render: (rowData) => {
                return <p>{rowData.ordPrice} $</p>;
            },
        },
        {
            title: "Payment Date",
            field: "paymentDate",
            align: "left",
        },
    ];

    const updateTableData = () => {
        getPaidListOrder(dataUser[0].id)
            .then((res) => {
                let result = res.data;
                console.log(result);
                let tmpArr = [];
                for (let i = 0; i < result.length; i++) {
                    // if (result[i].ord_store_infomation.includes("Amazon")) {
                    let tmp = result[i].paymentDate.split("T");
                    result[i].paymentDate = tmp[0];
                    tmpArr.push(result[i]);
                    // }
                }
                setData([...result]);
            })
            .catch((err) => toast.error(err));
    };
    useEffect(() => {
        updateTableData();
    }, []);
    console.log(data);

    return (
        <>
            <MaterialTable
                title=""
                columns={columns}
                data={data}
                // onRowClick={(evt, selectedRow) =>
                //     setSelectedRow(selectedRow.tableData.id)
                // }
                options={{
                    maxBodyHeight: 510,
                    searchFieldAlignment: "left",
                    headerStyle: {
                        backgroundColor: "#fafafa",
                        color: "#000000d9",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        // cursor: "default",
                    },
                    rowStyle: (rowData) => ({
                        backgroundColor:
                            selectedRow === rowData.tableData.id
                                ? "#EEE"
                                : "#FFF",
                    }),
                    sorting: true,
                    selection: false,
                    paging: false,
                }}
            />
        </>
    );
};

export default TransactionHistory;

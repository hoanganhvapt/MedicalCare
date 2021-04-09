import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { toast } from "react-toastify";
import { getListCarrier } from "./ProductService";

toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const Carrier = (props) => {
    const [data, setData] = useState([]);
    const columns = [
        {
            title: "Carrier Name",
            field: "label",
            align: "center",
            headerStyle: {
                pointerEvents: "none",
            },
            cellStyle: {
                fontWeight: 600,
                color: "#f95d01",
            },
        },
        {
            title: "Priority",
            field: "type",
            align: "center",
            headerStyle: {
                pointerEvents: "none",
            },
        },
        {
            title: "Status",
            field: "status",
            align: "center",
            headerStyle: {
                pointerEvents: "none",
            },
            render: (rowData) => (rowData.status === 1 ? "Active" : "Deactive"),
        },
        {
            title: "User Created",
            field: "userCreated",
            align: "center",
            headerStyle: {
                pointerEvents: "none",
            },
        },
    ];

    const updateData = () => {
        getListCarrier()
            .then((res) => setData(res.data.data))
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        updateData();
    }, []);
    console.log(data);
    return (
        <MaterialTable
            title=""
            columns={columns}
            data={data}
            actions={[
                {
                    tooltip: "Edit",
                    icon: "edit",
                    // onClick: (evt, data) => handleOpenDialogEdit(data.id),
                },
                {
                    tooltip: "Delete",
                    icon: "delete",
                    // onClick: (evt, data) => handleOpenDialogDelete(data),
                },
            ]}
            options={{
                minBodyHeight: 0,
                maxBodyHeight: 510,
                searchFieldAlignment: "left",
                headerStyle: {
                    backgroundColor: "#fafafa",
                    color: "#000000d9",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    cursor: "default",
                },
                sorting: false,
                selection: false,
                paging: false,
            }}
        />
    );
};

export default Carrier;

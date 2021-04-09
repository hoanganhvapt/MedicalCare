import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { getListProduct } from "./ProductService";
import { toast } from "react-toastify";
import { Grid, Tooltip } from "@material-ui/core";
import { Button } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import { Drawer } from "antd";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
    position: "top-center",
});
const Product = (props) => {
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const closeDrawer = () => {
        setVisible(false);
    };

    const columns = [
        {
            title: "",
            field: "store_media",
            align: "center",
            cellStyle: {
                width: 50,
                padding: 8,
            },
            headerStyle: {
                width: 50,
                pointerEvents: "none",
            },
            render: (rowData) => (
                <Tooltip
                    title={
                        <div
                            style={{
                                width: 300,
                                height: "auto",
                                objectFit: "content",
                            }}
                        >
                            <img
                                alt={rowData.product_name}
                                width="95%"
                                height="auto"
                                src={rowData.store_media ? rowData.store_media : "images/default.jpg"}
                            />
                        </div>
                    }
                    placement="right-start"
                    arrow
                >
                    <span className="box-image">
                        <img alt={rowData.product_name} src={rowData.store_media ? rowData.store_media : "images/default.jpg"} />
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Title",
            align: "left",
            width: "100%",
            headerStyle: {
                pointerEvents: "none",
            },
            render: (rowData) => (
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        style={{
                            color: "#f95d01",
                            fontWeight: 600,
                        }}
                    >
                        {rowData.product_name}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        style={{
                            color: "#61605F",
                        }}
                    >
                        SKU: {rowData.sku}
                    </Grid>
                </Grid>
            ),
        },
        {
            title: "Product Type",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
            render: (rowData) => (
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        style={{
                            fontWeight: 600,
                        }}
                    >
                        {rowData.prod_name}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        style={{
                            color: "#61605F",
                        }}
                    >
                        SKU: {rowData.pro_sku}
                    </Grid>
                </Grid>
            ),
        },
        {
            title: "Created Date",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
            render: (rowData) => <Grid>{rowData.datetime_create.split("T")[0]}</Grid>,
        },
        {
            title: "Seller",
            field: "user_id_email",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
        },
        {
            title: "Status",
            field: "prod_processing_time",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
            render: (rowData) => <Grid>{rowData.amazon_auto_custom === 1 ? "Custom" : "Default"}</Grid>,
        },
        {
            title: "Action",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
            render: (rowData) => (
                <Grid>
                    <Button className="mr-3" size="sm" variant="info">
                        View
                    </Button>
                </Grid>
            ),
        },
    ];
    const updateTableData = () => {
        getListProduct()
            .then((res) => {
                let result = res.data.data;
                // for (let i = 0; i < result.length; i++) {
                //     let thumbUrlStr = result[i].prod_image;
                //     thumbUrlStr = thumbUrlStr
                //         .substr(thumbUrlStr.length - (thumbUrlStr.length - 1), thumbUrlStr.length - 2)
                //         .replace(/\},\{/g, "}#{")
                //         .split("#");
                //     let thumbUrlArr = [];
                //     for (let i = 0; i < thumbUrlStr.length; i++) {
                //         thumbUrlArr.push(JSON.parse(thumbUrlStr[i]));
                //     }
                //     result[i].prod_image = thumbUrlArr;
                // }
                console.log(result);
                setData(result);
            })
            .catch((err) => toast.error(err));
    };

    useEffect(() => {
        updateTableData();
    }, []);
    return (
        <>
            <Grid container className="pb-2">
                <Button className="mr-3" size="sm" variant="primary" onClick={showDrawer}>
                    <AddIcon />
                    New Product
                </Button>
            </Grid>
            <MaterialTable
                title=""
                columns={columns}
                data={data}
                actions={[
                    {
                        tooltip: "Edit All Selected Product Type",
                        icon: "edit",
                        onClick: (evt, data) => toast.success("Successfully"),
                    },
                    {
                        tooltip: "Delete All Selected Product Type",
                        icon: "delete",
                        onClick: (evt, data) => console.log(data.map((item) => item.id)),
                    },
                ]}
                onRowClick={(evt, selectedRow) => setSelectedRow(selectedRow.tableData.id)}
                options={{
                    maxBodyHeight: 540,
                    searchFieldAlignment: "left",
                    headerStyle: {
                        backgroundColor: "#fafafa",
                        color: "#000000d9",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        cursor: "default",
                    },
                    rowStyle: (rowData) => ({
                        backgroundColor: selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
                    }),
                    sorting: false,
                    selection: true,
                    paging: false,
                }}
            />
            <Drawer title="Select Product Type" placement="right" closable={false} onClose={closeDrawer} visible={visible} width="85%">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </>
    );
};

export default Product;

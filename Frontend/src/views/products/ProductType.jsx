import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { getListProductType } from "./ProductService";
import { toast } from "react-toastify";
import { Grid, Tooltip } from "@material-ui/core";
import { Button } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { Drawer } from "antd";
import ProductAddNew from "./ProductAddNew";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
    position: "top-center",
});
const ProductType = (props) => {
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataCampaign, setDataCampaign] = useState([]);

    const showDrawer = (data) => {
        setDataCampaign(data);
        setVisible(true);
    };
    const closeDrawer = () => {
        setVisible(false);
    };

    const columns = [
        {
            title: "",
            field: "prod_image",
            align: "center",
            cellStyle: {
                padding: 8,
                width: 50,
            },
            headerStyle: {
                pointerEvents: "none",
                width: 50,
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
                                alt={rowData.prod_name}
                                width="95%"
                                height="auto"
                                src={rowData.prod_image ? rowData.prod_image[0].data.thumbUrl : "images/default.jpg"}
                            />
                        </div>
                    }
                    placement="right-start"
                    arrow
                >
                    <span className="box-image">
                        <img
                            alt={rowData.prod_name}
                            src={rowData.prod_image ? rowData.prod_image[0].data.thumbUrl : "images/default.jpg"}
                        />
                    </span>
                </Tooltip>
            ),
        },
        {
            title: "Name",
            field: "prod_name",
            align: "left",
            width: "100%",
            headerStyle: {
                pointerEvents: "none",
            },
            cellStyle: {
                color: "#f95d01",
                fontWeight: 600,
            },
        },
        {
            title: "Code",
            field: "prod_code",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
        },
        {
            title: "Base Cost",
            field: "prod_base_cost",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
        },
        {
            title: "Shipping Time",
            field: "prod_shipping_time",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
        },
        {
            title: "Processing Time",
            field: "prod_processing_time",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
        },
        {
            title: "Suppliers",
            field: "sup_name",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
        },
        {
            title: "Category",
            field: "cat_name",
            align: "left",
            headerStyle: {
                pointerEvents: "none",
            },
        },
    ];
    const updateTableData = () => {
        getListProductType()
            .then((res) => {
                let result = res.data.data;
                console.log(result);
                for (let i = 0; i < result.length; i++) {
                    let urlImageStr = result[i].prod_image;
                    urlImageStr = urlImageStr
                        .substr(urlImageStr.length - (urlImageStr.length - 1), urlImageStr.length - 2)
                        .replace(/\},\{/g, "}#{")
                        .split("#");
                    let urlImageArr = [];
                    for (let i = 0; i < urlImageStr.length; i++) {
                        urlImageArr.push(JSON.parse(urlImageStr[i]));
                    }
                    result[i].prod_image = urlImageArr;
                }
                setData(result);
                closeDrawer();
            })
            .catch((err) => toast.error(err));
    };
    useEffect(() => {
        updateTableData();
    }, []);
    return (
        <>
            <Grid container className="pb-2">
                <Button className="mr-3" size="sm" variant="primary" onClick={() => props.history.push("product-type/new")}>
                    <AddIcon />
                    New Product Type
                </Button>
            </Grid>
            <MaterialTable
                title=""
                columns={columns}
                data={data}
                actions={[
                    {
                        tooltip: "Create Campage All Selected",
                        icon: () => (
                            <Button variant="primary" size="sm">
                                <AddBoxIcon className="mr-1" />
                                Create Campaign
                            </Button>
                        ),
                        onClick: (evt, data) => showDrawer(data),
                    },
                    {
                        tooltip: "Edit All Selected",
                        icon: () => (
                            <Button variant="success" size="sm">
                                <EditIcon className="mr-1" />
                                Edit
                            </Button>
                        ),
                        onClick: (evt, data) => console.log(data[0]),
                    },
                    {
                        tooltip: "Delete All Selected",
                        icon: () => (
                            <Button variant="danger" size="sm">
                                <DeleteIcon className="mr-1" /> Delete
                            </Button>
                        ),
                        onClick: (evt, data) => console.log(data.map((item) => item.id)),
                    },
                ]}
                options={{
                    minBodyHeight: 0,
                    maxBodyHeight: 535,
                    searchFieldAlignment: "left",
                    headerStyle: {
                        backgroundColor: "#fafafa",
                        color: "#484848",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        cursor: "default",
                        zIndex: 9,
                    },
                    sorting: false,
                    selection: true,
                    paging: false,
                }}
            />
            <Drawer title="Create Campaign" placement="right" closable={false} onClose={closeDrawer} visible={visible} width="100%">
                <ProductAddNew updateTable={updateTableData} dataCampaign={dataCampaign[0]} />
            </Drawer>
        </>
    );
};

export default ProductType;

import React, { useEffect, useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import {
    getListOrder,
    getCarrier,
    getSupplier,
    getFilterProd,
    getOrderBySeller,
    getOrderByProduct,
    getOrderBySupplier,
    getOrderByStore,
    getOrderByDate,
} from "./OrderService";
import { toast } from "react-toastify";
import { Grid, Badge, IconButton, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SettingsIcon from "@material-ui/icons/Settings";
import { Menu, Dropdown, Drawer, Select, DatePicker, Space, DateRange } from "antd";
import DialogReportCancel from "./DialogReportCancel";
import DialogReportView from "./DialogReportView";
import DrawerFileDesign from "./DrawerFileDesign";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useSelector } from "react-redux";
import axios from "axios";
import { getListSeller } from "../User/UserService";
import { getFilterSup } from "./OrderService";
import { getListSiteByUserId } from "../Sites/SiteService";
import { ImportOutlined } from "@ant-design/icons";
import DialogImportOrder from "./DialogImportOrder";

toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const Order = (props) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [openResend, setOpenResend] = useState(false);
    const [openRefund, setOpenRefund] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openPartRefund, setOpenPartRefund] = useState(false);
    const [openDesign, setOpenDesign] = useState(false);
    const [orderDesign, setOrderDesign] = useState([]);
    const [prodDesign, setProdDesign] = useState([]);
    const [orderStatus, setOrderStatus] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [all, setAll] = useState([]);
    const [pending, setPending] = useState([]);
    const [unpaid, setUnpaid] = useState([]);
    const [inProduction, setInproduction] = useState([]);
    const [request, setRequest] = useState([]);
    const [shipped, setShipped] = useState([]);
    const [id, setId] = useState(null);
    const [orderReason, setOrderReason] = useState(null);
    const [titleViewDesign, setTitleViewDesign] = useState(null);
    const [timeEntered, setTimeEntered] = useState(null);
    const [dbId, setDbId] = useState(null);
    const dataUser = useSelector((state) => state.user.dataUser[0]);
    const [supplier, setSupplier] = useState([]);
    const [productType, setProductType] = useState([]);
    const [openImportOrder, setOpenImportOrder] = useState(false);
    const [fullFile, setFullFile] = useState([]);
    const [missingFile, setMissingFile] = useState([]);
    const userId = dataUser.id;
    const [openMoreFilter, setOpenMoreFilter] = useState(false);
    const [dateStart, setDateStart] = useState([]);
    const [dateEnd, setDateEnd] = useState([]);
    const dateFormat = "YYYY/MM/DD";

    function onOk(value) {
        console.log("onOk: ", value);
    }

    const { RangePicker } = DatePicker;
    // Get List Supplier
    // if (dataUser.role_id === 10) {
    const getSupplier = () => {
        getFilterSup()
            .then((res) => {
                setSupplier(res.data.data);
            })
            .catch((err) => console.log(err));
    };
    // }
    // END

    // Get List Product Type
    const getProductType = () => {
        getFilterProd()
            .then((res) => {
                setProductType(res.data.data);
            })
            .catch((err) => console.log(err));
    };
    // END

    // Get List Seller
    const [seller, setSeller] = useState([]);
    const getSeller = () => {
        getListSeller()
            .then((res) => {
                setSeller(res.data.data);
            })
            .catch((err) => console.log(err));
    };
    // END

    // Get List Site
    const [site, setSite] = useState([]);
    const getSite = () => {
        getListSiteByUserId({ user_id: userId })
            .then((res) => {
                setSite(res.data.data);
            })
            .catch((err) => console.log(err));
    };
    // END

    // Order Filter
    const { Option } = Select;

    const onChangeFileDesign = (value) => {
        if (value === "All") {
            setData([...all]);
        }
        if (value === "Full Design") {
            setData([...fullFile]);
        }
        if (value === "Missing Design") {
            setData([...missingFile]);
        }
    };

    function onBlur() {
        console.log("blur");
    }

    const onFocus = () => {
        console.log("focus");
    };

    const onSearch = (val) => {
        console.log("search:", val);
    };
    // END

    const menu = (data) => (
        <Menu>
            {dataUser.role_id == 6 &&
                (data.order_status == 0 ||
                    data.order_status == 1 ||
                    (data.order_status == 2 && (
                        <Menu.Item key="0">
                            <a onClick={() => handleOpenDialogEdit(data.order_id)}>Cancel</a>
                        </Menu.Item>
                    )))}
            {dataUser.role_id == 6 && data.order_status == 15 && (
                <Menu.Item key="1">
                    <a onClick={() => handleOpenDialogResend(data.order_id)}>Resend</a>
                </Menu.Item>
            )}
            {dataUser.role_id == 6 && data.order_status == 5 && (
                <Menu.Item key="2">
                    <a onClick={() => handleOpenDialogPartRefund(data.order_id)}>Partially Refund</a>
                </Menu.Item>
            )}
            {dataUser.role_id == 6 && data.order_status == 15 && (
                <Menu.Item key="2">
                    <a onClick={() => handleOpenDialogRefund(data.order_id)}>Full Refund</a>
                </Menu.Item>
            )}
            {(dataUser.role_id == 2 || dataUser.role_id == 3 || dataUser.role_id == 7) &&
                (data.order_status == 6 || data.order_status == 8 || data.order_status == 10 || data.order_status == 13) && (
                    <Menu.Item key="3">
                        <a
                            onClick={() =>
                                handleOpenDialogView(
                                    data.order_id,
                                    data.order_reason,
                                    data.order_status,
                                    data.prod_url_design_printer,
                                    data.printer_design_url,
                                    data.dtime_get,
                                    data.payment_status
                                )
                            }
                        >
                            {data.title_status}
                        </a>
                    </Menu.Item>
                )}
        </Menu>
    );
    const columns = [
        {
            title: "Action",
            align: "center",
            render: (rowData) => {
                return (
                    <>
                        <Dropdown overlay={menu(rowData)} trigger={["click"]}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <SettingsIcon />
                            </a>
                        </Dropdown>
                    </>
                );
            },
        },
        {
            title: "Order Number",
            align: "left",

            cellStyle: {
                fontWeight: 600,
                color: "#f95d01",
            },
            render: (rowData) => {
                return <Link to={"/orders/" + rowData.order_id.replace("#", "")}>{rowData.order_id}</Link>;
            },
        },
        {
            title: "Received Date",
            field: "dtime_entered",
            align: "left",
        },
        {
            title: "Product",
            align: "left",
            render: (rowData) => {
                return (
                    <>
                        <Link to={"/orders/" + rowData.order_id.replace("#", "")}>{rowData.product_name}</Link>
                        <p className="mb-0">{rowData.sku}</p>
                    </>
                );
            },
            cellStyle: {
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 100,
            },
        },
        {
            title: "Product Type",
            align: "left",
            field: "prod_name",
            cellStyle: {
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 100,
            },
        },
        {
            title: "Price",
            field: "total_price",
            align: "left",
        },
        {
            title: "Quantity",
            field: "quantity",
            align: "left",
        },
        {
            title: "Seller",
            field: "user_name",
            align: "left",
        },
        {
            title: "Design",
            align: "left",

            render: (rowData) => {
                return (
                    <Grid>
                        <Grid container className="pb-2">
                            <a
                                className="btn btn-link"
                                onClick={() =>
                                    handleOpenDrawerDesign(
                                        rowData.id,
                                        rowData.order_id,
                                        rowData.printer_design_url,
                                        rowData.prod_url_design_printer,
                                        rowData.order_status,
                                        rowData.payment_status
                                    )
                                }
                            >
                                View
                            </a>
                        </Grid>
                    </Grid>
                );
            },
        },
        {
            title: "Status",
            align: "left",
            render: (rowData) => {
                let status_order = "";
                let status_payment = "";
                let orderStatus = rowData.order_status;
                let paymentStatus = rowData.payment_status;
                switch (orderStatus) {
                    case 0:
                        status_order = "Cooling Off";
                        break;
                    case 1:
                        status_order = "Pending Design";
                        break;
                    case 2:
                        status_order = "Waiting Payment Confirm";
                        break;
                    case 5:
                        status_order = "In Production";
                        break;
                    case 6:
                        status_order = "Request Cancel";
                        break;
                    case 7:
                        status_order = "Cancelled";
                        break;
                    case 8:
                        status_order = "Request Resend";
                        break;
                    case 9:
                        status_order = "Resend";
                        break;
                    case 10:
                        status_order = "Request Refund";
                        break;
                    case 11:
                        status_order = "Partially Refund";
                        break;
                    case 12:
                        status_order = "Full Refund";
                        break;
                    case 13:
                        status_order = "Request partially refund";
                        break;
                    case 15:
                        status_order = "Shipped";
                        break;
                }
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
                        <p
                            className="mb-1"
                            style={{
                                color: "red",
                            }}
                        >
                            {status_order}
                        </p>
                        <p
                            className="mb-0"
                            style={{
                                color: "blue",
                            }}
                        >
                            {status_payment}
                        </p>
                    </>
                );
            },
        },
    ];

    const updateTableData = async () => {
        let sup_coder = "";
        if ("sup_code" in dataUser) {
            sup_coder = dataUser.sup_code;
        }
        let request_role = {
            user_id: dataUser.id,
            role_id: dataUser.role_id,
            sup_code: sup_coder,
        };
        await getListOrder(request_role)
            .then(async (res) => {
                requestSuccessData(res);
            })
            .catch((err) => toast.error(err));
    };
    const onChangeSeller = async (value) => {
        await getOrderBySeller({ user_id: value })
            .then((res) => {
                requestSuccessData(res);
            })
            .catch((err) => toast.error(err));
    };
    const onChangeProductType = async (value) => {
        await getOrderByProduct({ prod_code: value })
            .then((res) => {
                requestSuccessData(res);
            })
            .catch((err) => toast.error(err));
    };
    const onChangeSupplier = async (value) => {
        await getOrderBySupplier({ sup_code: value })
            .then((res) => {
                requestSuccessData(res);
            })
            .catch((err) => toast.error(err));
    };
    const onChangeStore = async (value) => {
        await getOrderByStore({ store_id: value })
            .then((res) => {
                requestSuccessData(res);
            })
            .catch((err) => toast.error(err));
    };

    const onChangDate = async () => {};
    const onStartSelect = (value) => {
        console.log(`start format: ${value.format(dateFormat)}`);
        const dateStartFormated = `${value.format(dateFormat)}`;
        setDateStart(dateStartFormated);
    };

    const onEndSelect = (value) => {
        console.log(`end format: ${value.format(dateFormat)}`);
        const dateEndFormated = `${value.format(dateFormat)}`;
        setDateStart(dateEndFormated);
    };
    const dateArray = [];
    const onChange = (value, dateString) => {
        console.log("Selected Time: ", value);
        console.log("Formatted Selected Time: ", dateString);
        dateArray.push(dateString[0]);
        dateArray.push(dateString[1]);
        console.log("Array: " + dateArray);
        getOrderByDate({
            date_start: dateArray[0],
            date_end: dateArray[1],
        })
            .then((res) => {
                requestSuccessData(res);
            })
            .catch((err) => toast.error(err));
    };
    useEffect(() => {
        updateTableData();
        // onBlur();
        // onFocus();
        // onChangeSeller();
        onChangeFileDesign();
        // onChangeProductType();
        // onChangeSupplier();
        getSeller();
        getSupplier();
        getProductType();
        getSite();
    }, []);

    const requestSuccessData = (res) => {
        let result = res.data.data;
        let tmp = [];
        let tmpUnpaid = [];
        let tmpPending = [];
        let tmpInProduction = [];
        let tmpRequest = [];
        let tmpShipped = [];
        let tmpFullFile = [];
        let tmpMissingFile = [];
        for (let i = 0; i < result.length; i++) {
            if (
                typeof result[i].printer_design_url === "string" &&
                result[i].printer_design_url != "" &&
                result[i].printer_design_url != "undefined"
            ) {
                result[i].printer_design_url = JSON.parse(result[i].printer_design_url);
            }
            if (typeof result[i].prod_url_design_printer === "string" && result[i].prod_url_design_printer != "") {
                result[i].prod_url_design_printer = JSON.parse(result[i].prod_url_design_printer);
            }
            let count_file_order = 0;
            let count_file_prod = 0;
            if (result[i].printer_design_url != "") {
                count_file_order = result[i].printer_design_url.length;
            }
            if (result[i].prod_url_design_printer != "") {
                count_file_prod = result[i].prod_url_design_printer.length;
            }
            if (count_file_order == count_file_prod) {
                tmpFullFile.push(result[i]);
            }
            if (count_file_order < count_file_prod) {
                tmpMissingFile.push(result[i]);
            }
            console.log(1);
            let tmp = result[i].dtime_entered.split("T");
            result[i].dtime_entered = tmp[0];
        }
        for (let i = 0; i < result.length; i++) {
            switch (result[i].order_status) {
                case 0:
                case 1:
                case 2:
                    if (dataUser.role_id !== 10) {
                        tmpPending.push(result[i]);
                    }
                    break;
                case 5:
                    tmpInProduction.push(result[i]);
                    break;
                case 6:
                case 8:
                case 7:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    tmpRequest.push(result[i]);
                    break;
                case 15:
                    tmpShipped.push(result[i]);
                    break;
            }
            if (
                (result[i].payment_status === 0 || result[i].payment_status === 1 || result[i].payment_status === 2) &&
                dataUser.role_id !== 10
            ) {
                tmpUnpaid.push(result[i]);
            }
        }
        for (let n = 0; n < result.length; n++) {
            tmp.push(result[n]);
        }
        setFullFile(tmpFullFile);
        setMissingFile(tmpMissingFile);
        setUnpaid(tmpUnpaid);
        setPending(tmpPending);
        setRequest(tmpRequest);
        setInproduction(tmpInProduction);
        setShipped(tmpShipped);
        setAll(tmp);
        setData(tmp);
        handleCloseDialog();
    };

    const setAllData = () => {
        setData([...all]);
    };
    const setPendingData = () => {
        setData([...pending]);
    };
    const setUnpaidData = () => {
        setData([...unpaid]);
    };
    const setInproducttionData = () => {
        setData([...inProduction]);
    };
    const setRequestData = () => {
        setData([...request]);
    };
    const setShippedData = () => {
        setData([...shipped]);
    };
    const handleOpenDialogEdit = (id) => {
        setOpenEdit(true);
        setId(id);
    };
    const handleOpenDialogResend = (id) => {
        setOpenResend(true);
        setId(id);
    };
    const handleOpenDialogRefund = (id) => {
        setOpenRefund(true);
        setId(id);
    };
    const handleOpenDialogPartRefund = (id) => {
        setOpenPartRefund(true);
        setId(id);
    };

    const handleOpenDialogImportOrder = () => {
        setOpenImportOrder(true);
    };
    const handleOpenDialogView = (
        id,
        order_reason,
        order_status,
        prod_url_design_printer,
        printer_design_url,
        dtime_entered,
        payment_status
    ) => {
        setId(id);
        setOrderReason(order_reason);
        setOrderStatus(order_status);
        setTimeEntered(dtime_entered);
        setProdDesign(prod_url_design_printer);
        setOrderDesign(printer_design_url);
        setPaymentStatus(payment_status);
        setOpenView(true);
    };
    const handleCloseDialog = () => {
        setOpenMoreFilter(false);
        setOpenImportOrder(false);
        setOpenEdit(false);
        setOpenResend(false);
        setOpenRefund(false);
        setOpenPartRefund(false);
        setOpenView(false);
        setOpenDesign(false);
        setOrderDesign(null);
        setProdDesign(null);
        setOrderStatus(null);
        setPaymentStatus(null);
    };

    const handleOpenDrawerDesign = (db_id, order_id, order_design, prod_design, order_status, payment_status) => {
        setDbId(db_id);
        setId(order_id);
        setOrderDesign(order_design);
        setProdDesign(prod_design);
        setOrderStatus(order_status);
        setPaymentStatus(payment_status);
        setTitleViewDesign("View print file design : " + order_id);
        setOpenDesign(true);
        console.log(db_id, order_design, order_id, prod_design, order_status, payment_status);
    };

    const handleExportOrder = async (data) => {
        if (data.length > 0) {
            let arr_order = [];
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                arr_order.push(item.order_id);
            }
            let orderStr = JSON.stringify(arr_order);
            if (arr_order.length > 0) {
                await axios
                    .get("https://pro.printway.io/shopify/public/orders/download?order=" + orderStr)
                    .then((res) => {
                        window.location.href = res.data.success;
                    })
                    .catch((err) => console.log(err));
            }
        }
    };
    return (
        <>
            {/* {openImportOrder && (
                <DialogImportOrder
                    close={() => handleCloseDialog()}
                    open={openImportOrder}
                    role_id={dataUser.role_id}
                    user_id={dataUser.id}
                    update={() => updateTableData()}
                />
            )} */}
            {openEdit && (
                <DialogReportCancel
                    close={() => handleCloseDialog()}
                    id={id}
                    open={openEdit}
                    type="Cancel"
                    update={() => updateTableData()}
                />
            )}
            {openRefund && (
                <DialogReportCancel
                    close={() => handleCloseDialog()}
                    id={id}
                    open={openRefund}
                    type="Refund"
                    update={() => updateTableData()}
                />
            )}
            {openPartRefund && (
                <DialogReportCancel
                    close={() => handleCloseDialog()}
                    id={id}
                    open={openPartRefund}
                    type="Partially Refund"
                    update={() => updateTableData()}
                />
            )}
            {openResend && (
                <DialogReportCancel
                    close={() => handleCloseDialog()}
                    id={id}
                    open={openResend}
                    type="Resend"
                    update={() => updateTableData()}
                />
            )}
            {openView && (
                <DialogReportView
                    close={() => handleCloseDialog()}
                    id={id}
                    order_reason={orderReason}
                    open={openView}
                    order_status={orderStatus}
                    payment_status={paymentStatus}
                    printer_design_url={orderDesign}
                    prod_url_design_printer={prodDesign}
                    dtime_entered={timeEntered}
                    type="View"
                    update={() => updateTableData()}
                />
            )}
            <Drawer
                title={titleViewDesign}
                placement="right"
                closable={true}
                onClose={() => setOpenDesign(false)}
                visible={openDesign}
                width="35%"
            >
                <DrawerFileDesign
                    db_id={dbId}
                    id={id}
                    printer_design_url={orderDesign}
                    prod_url_design_printer={prodDesign}
                    order_status={orderStatus}
                    payment_status={paymentStatus}
                    type="View"
                    close={() => {
                        setId(null);
                        setOrderDesign([]);
                        setProdDesign([]);
                        setOrderStatus(null);
                        setPaymentStatus(null);
                        setOpenDesign(false);
                    }}
                    update={() => updateTableData()}
                />
            </Drawer>
            <MaterialTable
                title=""
                columns={columns}
                data={data}
                actions={[
                    {
                        tooltip: "Create Campage All Selected",
                        icon: () => (
                            <Button variant="primary" size="sm">
                                <GetAppIcon className="mr-1" />
                                Export orders
                            </Button>
                        ),
                        onClick: (evt, data) => handleExportOrder(data),
                    },
                ]}
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
                        backgroundColor: selectedRow === rowData.tableData.id ? "#EEE" : "#FFF",
                    }),
                    sorting: true,
                    selection: true,
                    paging: false,
                }}
                components={{
                    Toolbar: (props) => (
                        <>
                            {" "}
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Filter by store"
                                optionFilterProp="children"
                                onChange={onChangeStore}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onSearch={onSearch}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {site.map((item) => (
                                    <Option value={item.id}>{item.store_name}</Option>
                                ))}
                            </Select>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Filter by product type"
                                optionFilterProp="children"
                                onChange={onChangeProductType}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onSearch={onSearch}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {productType.map((item) => (
                                    <Option value={item.prod_code}>
                                        {item.prod_code}
                                        {" - "}
                                        {item.prod_name}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Filter by seller"
                                optionFilterProp="children"
                                onChange={onChangeSeller}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onSearch={onSearch}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {seller.map((item) => (
                                    <Option value={item.id}>{item.seller_name}</Option>
                                ))}
                            </Select>
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Filter by supplier"
                                optionFilterProp="children"
                                onChange={onChangeSupplier}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                onSearch={onSearch}
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {supplier.map((item) => (
                                    <Option value={item.sup_code}>
                                        {item.sup_code}
                                        {" - "}
                                        {item.sup_name}
                                    </Option>
                                ))}
                            </Select>
                            <Select defaultValue="File Design Status" style={{ width: 200 }} onChange={onChangeFileDesign}>
                                <Option value="All">All</Option>
                                <Option value="Full Design">Full Design</Option>
                                <Option value="Missing Design">Missing Design</Option>
                            </Select>
                            <Space direction="vertical" size={12}>
                                <RangePicker onChange={onChange} onOk={onOk} />
                            </Space>
                            {dataUser.role_id == 6 && (
                                <button className="float-right mt-3 btn btn-light" onClick={() => handleOpenDialogImportOrder()}>
                                    <ImportOutlined className="mr-2" />
                                    Import order
                                </button>
                            )}
                            <MTableToolbar {...props} />
                            <Grid container className="mb-2 mt-3">
                                <Grid item xs={2} justify="center" container>
                                    <Badge badgeContent={all.length} color="error">
                                        <Button className="btn-order" onClick={setAllData} size="sm">
                                            All
                                        </Button>
                                    </Badge>
                                </Grid>
                                {dataUser.role_id !== 10 && (
                                    <>
                                        <Grid item xs={2} justify="center" container>
                                            <Badge badgeContent={pending.length} color="error">
                                                <Button className="btn-order" onClick={setPendingData} size="sm">
                                                    Pending
                                                </Button>
                                            </Badge>
                                        </Grid>
                                        <Grid item xs={2} justify="center" container>
                                            <Badge badgeContent={unpaid.length} color="error">
                                                <Button className="btn-order" onClick={setUnpaidData} size="sm">
                                                    Unpaid
                                                </Button>
                                            </Badge>
                                        </Grid>
                                    </>
                                )}

                                <Grid item xs={2} justify="center" container>
                                    <Badge badgeContent={inProduction.length} color="error">
                                        <Button className="btn-order" onClick={setInproducttionData} size="sm">
                                            In production
                                        </Button>
                                    </Badge>
                                </Grid>
                                <Grid item xs={2} justify="center" container>
                                    <Badge badgeContent={request.length} color="error">
                                        <Button className="btn-order" onClick={setRequestData} size="sm">
                                            Request
                                        </Button>
                                    </Badge>
                                </Grid>
                                <Grid item xs={2} justify="center" container>
                                    <Badge badgeContent={shipped.length} color="error">
                                        <Button className="btn-order" onClick={setShippedData} size="sm">
                                            Shipped
                                        </Button>
                                    </Badge>
                                </Grid>
                            </Grid>
                        </>
                    ),
                }}
            />
        </>
    );
};

export default Order;

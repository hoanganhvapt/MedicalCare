import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { Select } from "antd";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { UploadOutlined, LinkOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getImportSite } from "./OrderService";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const DialogImportOrder = (props) => {
    const { open, close, type, update, id, role_id, user_id } = props;
    const { Option } = Select;
    const [title, setTitle] = useState(null);
    const [url, setUrl] = useState(null);
    const dataUser = useSelector((state) => state.user.dataUser[0]);
    const [siteFill, setSiteFill] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const onChange = (value) => {
        setStoreId(value);
    };

    // const onBlur = () => {
    //     console.log("blur");
    // };

    // const onFocus = () => {
    //     console.log("focus");
    // };

    // const onSearch = (val) => {
    //     console.log("search:", val);
    // };
    const handleSubmitDialog = async () => {
        let formData = new FormData();
        let files = document.getElementById("for_excel").files;
        if (files != undefined) {
            formData.append("upload_order", files);
            formData.append("role_id", role_id);
            if (storeId !== null) {
                formData.append("store_id", storeId);
            }
            console.log(formData);
            await axios
                .post(
                    "https://pro.printway.io/shopify/public/orders/import",
                    formData
                )
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => console.log(err));
        }
    };
    const getSite = async () => {
        getImportSite({ user_id: dataUser.id })
            .then((res) => {
                let siteTmp = res.data.data;
                console.log(siteTmp);
                setSiteFill(siteTmp);
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        if (role_id == 6) {
            setTitle("Import order");
            setUrl(
                "https://pro.printway.io/shopify/storage/app/import_order_template.csv"
            );
        }
        if (role_id == 10) {
            setTitle("Import tracking");
            setUrl(
                "https://pro.printway.io/shopify/storage/app/Printways Production System.csv"
            );
        }
        getSite();
    }, []);
    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth="sm"
                open={open}
                onClose={close}
                style={{ zIndex: 1000 }}
            >
                <DialogTitle className="border-bottom">{title}</DialogTitle>
                <DialogContent className="pt-4">
                    <p className="w-100 d-inline-block mb-0">
                        <a
                            className="float-right pt-0 pr-2 mr-0 btn btn-link text-dark"
                            href={url}
                        >
                            <LinkOutlined className="mr-2" />
                            Download template
                        </a>
                    </p>
                    {role_id === 6 && (
                        <>
                            <p className="mb-2">
                                Choose site to upload order :{" "}
                            </p>
                            <Select
                                id="site_choose"
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Select your site"
                                optionFilterProp="children"
                                onChange={onChange}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {siteFill.map((item) => (
                                    <Option value={item.id}>
                                        {item.store_name}
                                    </Option>
                                ))}
                            </Select>
                        </>
                    )}

                    <input
                        type="file"
                        className="d-none"
                        name="file_order"
                        id="for_excel"
                    />
                    <div className="w-100 pt-4">
                        <p className="mb-1">Upload file (csv/xlsx):</p>
                        <label
                            className="btn border-secondary mx-auto"
                            style={{ width: "28%" }}
                            for="for_excel"
                        >
                            <UploadOutlined />
                            Click to Upload
                        </label>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleSubmitDialog()}
                        size="sm"
                        variant="primary"
                    >
                        Save
                    </Button>
                    <Button onClick={close} size="sm" variant="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DialogImportOrder;

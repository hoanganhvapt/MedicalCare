import React, { useEffect, useState } from "react";
import { Grid, IconButton, Tooltip, AppBar, Toolbar } from "@material-ui/core";
import { Button } from "react-bootstrap";
import { Upload, Modal } from "antd";
import { Typography, Image, Divider } from "antd";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { toast } from "react-toastify";
import Dragger from "antd/lib/upload/Dragger";
import SaveIcon from "@material-ui/icons/Save";
import { updateNewDesign, uploadNewDesign } from "./OrderService";

const { Text, Title } = Typography;

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const today = new Date();
const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date + " " + time;

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const DrawerFileDesign = (props) => {
    const {
        open,
        close,
        update,
        db_id,
        id,
        printer_design_url,
        prod_url_design_printer,
        order_status,
        payment_status,
    } = props;
    const [urlDesign, setUrlDesign] = useState([]);
    const [fakeDesign, setFakeDesign] = useState([]);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [variant, setVariant] = useState([]);
    const [state, setState] = useState({
        image: [],
    });
    const [previewVisible, setPreviewVisible] = useState(false);
    useEffect(() => {
        if (prod_url_design_printer != null && printer_design_url != null) {
            let arr_new = [];
            for (let i = 0; i < prod_url_design_printer.length; i++) {
                let pr_design = "";
                if (
                    printer_design_url != null &&
                    printer_design_url.length !== 0
                ) {
                    pr_design = printer_design_url[i];
                }

                let obj_new = {
                    name: prod_url_design_printer[i].name,
                    note: prod_url_design_printer[i].note,
                    url_design: pr_design,
                    url_new_design: "",
                };
                arr_new.push(obj_new);
            }
            setUrlDesign(arr_new);
        }
    }, [
        db_id,
        id,
        printer_design_url,
        prod_url_design_printer,
        order_status,
        payment_status,
    ]);
    const handlePreviewImage = async (file) => {
        if (!file.thumbUrl && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewVisible(true);
        setPreviewImage(file.thumbUrl || file.preview);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
    };
    const handleChange = (e) => {
        if ((e.length >= 0) & (typeof e !== typeof "")) {
            let tmp = [];
            for (let i = 0; i < e.length; i++) {
                tmp.push(e[i].id);
            }
            return setState({
                ...state,
                carrierId: JSON.stringify(tmp),
            });
        }

        if (typeof e === typeof "")
            return setState({
                ...state,
                des: e,
            });

        if (e.target?.name === "proCode")
            return setState({
                ...state,
                proCode: e.target.value.toUpperCase(),
                sku: `${
                    state.supplierName + "-" + e.target.value.toUpperCase()
                }`,
            });
        return setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };
    const handleDeleteDesign = (name) => {
        let design = urlDesign.filter((el) => el.name === name);
        let index = urlDesign.findIndex((el) => el.name === name);
        design[0].url_new_design = "";
        urlDesign[index] = design[0];
        setUrlDesign([...urlDesign]);
    };
    const handleCancel = () => setPreviewVisible(false);
    const handleSubmit = async () => {
        var imageArr = [];
        let flag = true;
        for (let i = 0; i < urlDesign.length; i++) {
            if (urlDesign[i].url_new_design === "") {
                if (urlDesign[i].url_design != []) {
                    imageArr.push(urlDesign[i].url_design);
                } else {
                    flag = false;
                    break;
                }
            } else {
                let formData = new FormData();
                formData.append("data", urlDesign[i].url_new_design.file);
                await uploadNewDesign(formData)
                    .then((res) => {
                        let image_url = `/images/orders/printing/${res.data.newName}`;
                        imageArr.push(image_url);
                    })
                    .catch((err) => console.log(err));
            }
        }

        if (flag == true) {
            let imageStr = JSON.stringify(imageArr);
            if (imageStr !== undefined) {
                let request = {
                    id: db_id,
                    order_id: id,
                    url_new_design: imageStr,
                    order_status: order_status,
                    payment_status: payment_status,
                };
                await updateNewDesign(request)
                    .then((res) => {
                        toast.success("Update file design successfully!");
                        update();
                    })
                    .catch((err) => toast.error(err));
            }
        } else {
            toast.error("Update missing file design");
        }
    };
    return (
        <div>
            {urlDesign.map((item) => (
                <React.Fragment key={item.name}>
                    <Grid container spacing={2}>
                        <Grid container item xs={9}>
                            <Image width={150} src={item.url_design} />
                            <Grid className="pl-3 ">
                                <Title level={4}>{item.name}</Title>
                                <Text>{item.note}</Text>
                            </Grid>
                        </Grid>
                        <Grid container item xs={3}>
                            {item.url_new_design === "" ? (
                                <Dragger
                                    name="file"
                                    accept="image/*"
                                    showUploadList={false}
                                    className="dropzone-mini"
                                    customRequest={(file) => {
                                        let fileType = file.file.name
                                            .split(".")
                                            .pop();
                                        let fileName = file.file.name
                                            .split(".")
                                            .shift();
                                        let newName =
                                            fileName +
                                            "-" +
                                            Date.now() +
                                            "." +
                                            fileType;
                                        const lengthFDesign = fakeDesign.length;
                                        const tmpObj = {};
                                        for (
                                            let i = 0;
                                            i < lengthFDesign;
                                            i++
                                        ) {
                                            Object.assign(tmpObj, {
                                                url: `/images/orders/printing/${newName}`,
                                                dataImage: [fakeDesign[i]],
                                                file: file.file,
                                                data:
                                                    fakeDesign[i].originFileObj,
                                            });
                                        }
                                        setUrlDesign(
                                            [...urlDesign].map((el) => {
                                                if (item.name === el.name)
                                                    return {
                                                        ...el,
                                                        url_new_design: tmpObj,
                                                    };
                                                return el;
                                            })
                                        );
                                    }}
                                    onChange={(file) => {
                                        let data = [];
                                        for (
                                            let i = 0;
                                            i < file.fileList.length;
                                            i++
                                        ) {
                                            let tmp = {
                                                ...file.fileList[i],
                                                status: "done",
                                            };
                                            data.push(tmp);
                                        }
                                        setFakeDesign(data);
                                    }}
                                >
                                    Click or drop files to upload
                                </Dragger>
                            ) : (
                                <div
                                    className="upload-design"
                                    style={{
                                        width: "150px",
                                    }}
                                >
                                    <Upload
                                        listType="picture-card"
                                        disabled={true}
                                        fileList={
                                            urlDesign.find(
                                                (el) => el.name === item.name
                                            ).url_new_design.dataImage
                                        }
                                        onChange={handleChange}
                                        itemRender={(originNode, file) => (
                                            <div className="ant-upload-item">
                                                <Tooltip
                                                    title="Delete"
                                                    placement="top"
                                                    arrow
                                                >
                                                    <IconButton
                                                        className="delete-image"
                                                        onClick={() =>
                                                            handleDeleteDesign(
                                                                item.name
                                                            )
                                                        }
                                                    >
                                                        <i className="feather icon-trash-2" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip
                                                    title="Preview"
                                                    placement="top"
                                                    arrow
                                                >
                                                    <IconButton
                                                        className="preview-image"
                                                        onClick={() =>
                                                            handlePreviewImage(
                                                                file
                                                            )
                                                        }
                                                    >
                                                        <i className="feather icon-eye" />
                                                    </IconButton>
                                                </Tooltip>
                                                {originNode}
                                            </div>
                                        )}
                                    />
                                    <Modal
                                        visible={previewVisible}
                                        title={previewTitle}
                                        footer={null}
                                        onCancel={handleCancel}
                                    >
                                        <img
                                            alt="example"
                                            style={{ width: "100%" }}
                                            src={previewImage}
                                        />
                                    </Modal>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                    <Divider />
                </React.Fragment>
            ))}
            <AppBar position="sticky">
                <Toolbar
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Button
                        className="mr-3 mb-0"
                        size="sm"
                        variant="secondary"
                        onClick={close}
                    >
                        <ArrowBackIcon />
                        Close
                    </Button>
                    <Button
                        className=" mb-0"
                        variant="primary"
                        size="sm"
                        onClick={handleSubmit}
                    >
                        <SaveIcon />
                        Save
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default DrawerFileDesign;

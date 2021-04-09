import React, { useState, useRef } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { isTouchDevice } from "../../utils";
import { TouchBackend } from "react-dnd-touch-backend";
import {
    Card,
    CardContent,
    Grid,
    CardHeader,
    IconButton,
    Tooltip,
} from "@material-ui/core";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { Upload, Modal } from "antd";
import { Button } from "react-bootstrap";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import Dragger from "antd/lib/upload/Dragger";
import {
    uploadRequestCancel,
    uploadRequestImage,
    uploadRequestRefund,
    uploadRequestResend,
    uploadRequestPartRefund,
} from "./OrderService";

toast.configure({
    limit: 3,
    autoClose: 3000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});
const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;
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
const type = "Image";

const DragableUploadListItem = ({
    originNode,
    file,
    handleDeleteImage,
    handlePreviewImage,
}) => {
    return (
        <div className={"ant-upload-draggable-list-item"}>
            <Tooltip title="Delete" placement="top" arrow>
                <IconButton
                    className="delete-image"
                    onClick={() => handleDeleteImage(file.uid)}
                >
                    <i className="feather icon-trash-2" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Preview" placement="top" arrow>
                <IconButton
                    className="preview-image"
                    onClick={() => handlePreviewImage(file)}
                >
                    <i className="feather icon-eye" />
                </IconButton>
            </Tooltip>
            {originNode}
        </div>
    );
};

const DialogReportCancel = (props) => {
    const { open, close, type, update, id } = props;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fakeFileList, setFakeFileList] = useState([]);

    const [requestInfo, setRequestInfo] = useState({
        order_reason: "",
    });

    const handleChange = (e) => {
        setRequestInfo({
            ...requestInfo,
            [e.target.name]: e.target.value,
        });
    };
    const handleCancel = () => setPreviewVisible(false);
    const handlePreviewImage = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewVisible(true);
        setPreviewImage(file.url || file.preview);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
    };

    const prop = {
        name: "file",
        accept: "image/*",
        multiple: true,
        showUploadList: false,
        maxCount: 5,
        customRequest: async (file) => {
            const lengthList = fileList.length;
            const lengthFList = fakeFileList.length;
            let fileType = file.file.name.split(".").pop();
            let fileName = file.file.name.split(".").shift();
            let newName = fileName + "-" + Date.now() + "." + fileType;

            for (let i = 0; i < lengthFList; i++) {
                let check = true;
                if (lengthList === 0) {
                    fileList.push(fakeFileList[i]);
                    state.image.push({
                        uid: fakeFileList[i].uid,
                        url: `/images/orders/${newName}`,
                        data: fakeFileList[i],
                        file: file.file,
                    });
                }
                if (lengthList > 0) {
                    for (let j = 0; j < lengthList; j++) {
                        if (fileList[j].uid === fakeFileList[i].uid) {
                            check = false;
                            break;
                        }
                    }
                    if (check === true) {
                        if (fileList.length === 20) {
                            toast.warning("Max total 20 files upload !");
                            break;
                        }
                        fileList.push(fakeFileList[i]);
                        state.image.push({
                            uid: fakeFileList[i].uid,
                            url: `/images/orders/${newName}`,
                            data: fakeFileList[i],
                            file: file.file,
                        });
                        break;
                    }
                }
            }
            setFileList([...fileList]);
            setState({
                ...state,
                image: [...state.image],
            });
        },
        onChange: (file) => {
            let data = [];
            for (let i = 0; i < file.fileList.length; i++) {
                let tmp = {
                    ...file.fileList[i],
                    status: "done",
                };
                data.push(tmp);
            }
            setFakeFileList(data);
        },
    };
    const [state, setState] = useState({
        image: [],
    });

    const handleDeleteImage = (id) => {
        let file = fileList.filter((el) => el.uid !== id);
        let fileState = state.image.filter((el) => el.uid !== id);
        setFileList([...file]);
        setState({
            ...state,
            image: fileState,
        });
    };
    const handleSubmitDialog = async () => {
        console.log(state.image);
        var arr_reason = {
            order_reason: "",
            images: "",
        };
        var image_ar = [];
        for (let i = 0; i < state.image.length; i++) {
            let formData = new FormData();
            formData.append("data", state.image[i].file);
            await uploadRequestImage(formData).then((res) => {
                let tmp = {
                    url: `/images/orders/${res.data.newName}`,
                    data: state.image[i].data,
                };
                image_ar.push(tmp.url);
            });
        }
        arr_reason.order_reason = requestInfo.order_reason;
        arr_reason.images = image_ar;
        var reason = JSON.stringify(arr_reason);
        if (type === "Cancel") {
            let request = {
                order_reason: reason,
                order_id: id,
                dateTimeCreate: dateTime,
            };
            try {
                await uploadRequestCancel(request);
                toast.success("Successfully!");
                update();
                console.log("check");
            } catch (err) {
                return toast.error("Error: " + err);
            }
        }
        if (type === "Resend") {
            let request = {
                order_reason: reason,
                order_id: id,
                dateTimeCreate: dateTime,
            };
            try {
                await uploadRequestResend(request);
                toast.success("Successfully!");
                update();
            } catch (err_1) {
                return toast.error("Error: " + err_1);
            }
        }
        if (type === "Refund") {
            let request = {
                order_reason: reason,
                order_id: id,
                dateTimeCreate: dateTime,
            };
            try {
                await uploadRequestRefund(request);
                toast.success("Successfully!");
                update();
            } catch (err_1) {
                return toast.error("Error: " + err_1);
            }
        }
        if (type === "Partially Refund") {
            let request = {
                order_reason: reason,
                order_id: id,
                dateTimeCreate: dateTime,
            };
            try {
                await uploadRequestPartRefund(request);
                toast.success("Successfully!");
                update();
            } catch (err_1) {
                return toast.error("Error: " + err_1);
            }
        }
    };

    return (
        <>
            <Dialog
                fullWidth={true}
                maxWidth="sm"
                open={open}
                onClose={close}
                style={{ zIndex: 1000 }}
            >
                <ValidatorForm onSubmit={handleSubmitDialog}>
                    <DialogTitle>
                        {type} {"order " + id}
                    </DialogTitle>
                    <DialogContent className="pt-4">
                        <TextValidator
                            className="w-100 pb-3"
                            variant="outlined"
                            label="Reason..."
                            name="order_reason"
                            value={requestInfo.order_reason}
                            onChange={handleChange}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                            size="small"
                            color="secondary"
                            required
                            autoComplete="off"
                        />
                        <Card className="mt-3 dialog-report-cancel">
                            <CardHeader title="Upload Image" />
                            <CardContent>
                                {fileList.length === 0 ? (
                                    <Dragger {...prop}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">
                                            Click or drop file to upload
                                        </p>
                                    </Dragger>
                                ) : (
                                    <DndProvider backend={backendForDND}>
                                        <Upload
                                            listType="picture-card"
                                            disabled={true}
                                            fileList={fileList}
                                            itemRender={(
                                                originNode,
                                                file,
                                                currFileList
                                            ) => (
                                                <DragableUploadListItem
                                                    originNode={originNode}
                                                    file={file}
                                                    fileList={currFileList}
                                                    handleDeleteImage={
                                                        handleDeleteImage
                                                    }
                                                    handlePreviewImage={
                                                        handlePreviewImage
                                                    }
                                                />
                                            )}
                                        >
                                            <Dragger
                                                {...prop}
                                                className="dropzone-mini"
                                            >
                                                Click or drop files to upload
                                            </Dragger>
                                        </Upload>
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
                                    </DndProvider>
                                )}
                            </CardContent>
                        </Card>
                        <Grid
                            container
                            className="pt-3"
                            alignItems="center"
                            justify="space-between"
                        ></Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleSubmitDialog}
                            size="sm"
                            // disabled={checkValidate}
                            variant="primary"
                        >
                            Save
                        </Button>
                        <Button onClick={close} size="sm" variant="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        </>
    );
};

export default DialogReportCancel;

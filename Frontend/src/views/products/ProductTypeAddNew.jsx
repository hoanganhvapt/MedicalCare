import React, { useEffect, useState, useRef, Fragment } from "react";
import {
    Card,
    CardContent,
    Grid,
    InputAdornment,
    CardHeader,
    IconButton,
    Tooltip,
    AppBar,
    Toolbar,
    Typography,
    CircularProgress,
} from "@material-ui/core";
import { Button } from "react-bootstrap";
import { Upload, Modal } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getListSupplier, getListCategory, uploadProductTypeImage, addNewProductType, getListCarrier } from "./ProductService";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { toast } from "react-toastify";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from "immutability-helper";
import { isTouchDevice } from "../../utils";
import DialogAddNew from "./DialogAddNew";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import MaterialTable from "material-table";
import makeAnimated from "react-select/animated";
import { useSelector } from "react-redux";

toast.configure({
    limit: 3,
    position: "top-center",
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const backendForDND = isTouchDevice() ? TouchBackend : HTML5Backend;

const today = new Date();
const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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

const ProductTypeAddNew = (props) => {
    const dataUser = useSelector((state) => state.user.dataUser[0]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fakeFileList, setFakeFileList] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [carrier, setCarrier] = useState([]);
    const [option1, setOption1] = useState([]);
    const [option2, setOption2] = useState([]);
    const [option3, setOption3] = useState([]);
    const [fakeDesign, setFakeDesign] = useState([]);
    const [randomString, setRandomString] = useState("");
    const [bulletPrint, setBulletPrint] = useState([
        {
            id: 1,
            content: "",
        },
    ]);
    const [printFile, setPrintFile] = useState([
        {
            id: 1,
            namePrint: "",
            notePrint: "",
        },
    ]);
    const [variant, setVariant] = useState([]);
    const [options, setOptions] = useState([
        {
            id: 1,
            variant: "",
            nameVariant: "option1",
        },
    ]);

    const [openDialog, setOpenDialog] = useState({
        supplier: false,
        category: false,
        carrier: false,
    });
    const [state, setState] = useState({
        name: "",
        proCode: "",
        image: [],
        baseCost: "",
        timeShip: "",
        timeProcess: "",
        dateTimeCreate: dateTime,
        dateTimeUpdate: dateTime,
        printFile: [],
        bulletPrint: [],
        des: "",
        supplier: "",
        supplierName: "",
        category: "",
        sku: "",
        salePrice: [
            { level: "vip1", price: undefined },
            { level: "vip2", price: undefined },
            { level: "vip3", price: undefined },
            { level: "vip4", price: undefined },
        ],
        carrierId: [],
    });

    const typeOptions = [
        {
            label: "Color",
            value: "color",
        },
        {
            label: "Size",
            value: "size",
        },
        {
            label: "Material",
            value: "material",
        },
        {
            label: "Style",
            value: "style",
        },
        {
            label: "Title",
            value: "title",
        },
        {
            label: "Other",
            value: "other",
        },
    ];
    const { Dragger } = Upload;
    const DragableUploadListItem = ({ originNode, moveImage, file, fileList, handleDeleteImage, handlePreviewImage }) => {
        const ref = useRef(null);
        const index = fileList.indexOf(file);
        const [{ isDragging }, drag] = useDrag({
            item: { type, id: file.uid, index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        });
        const [, drop] = useDrop({
            accept: type,
            drop(item) {
                if (!ref.current) {
                    return;
                }
                const dragIndex = item.index;
                const hoverIndex = index;
                if (dragIndex === hoverIndex) {
                    return;
                }
                moveImage(dragIndex, hoverIndex);
                item.index = hoverIndex;
            },
        });
        drag(drop(ref));
        return (
            <div ref={ref} className={"ant-upload-draggable-list-item"} style={{ cursor: "move", opacity: isDragging ? 0.4 : 1 }}>
                <Tooltip title="Delete" placement="top" arrow>
                    <IconButton className="delete-image" onClick={() => handleDeleteImage(file.uid)}>
                        <i className="feather icon-trash-2" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Preview" placement="top" arrow>
                    <IconButton className="preview-image" onClick={() => handlePreviewImage(file)}>
                        <i className="feather icon-eye" />
                    </IconButton>
                </Tooltip>
                {originNode}
            </div>
        );
    };
    const prop = {
        name: "file",
        accept: "image/*",
        multiple: true,
        showUploadList: false,
        maxCount: 20,
        customRequest: (file) => {
            const lengthList = fileList.length;
            const lengthFList = fakeFileList.length;
            for (let i = 0; i < lengthFList; i++) {
                let fileType = fakeFileList[i].name.split(".").pop();
                let fileName = fakeFileList[i].name.split(".").shift();
                let newName = fileName + "-" + Date.now() + "." + fileType;
                let check = true;
                if (lengthList === 0) {
                    fileList.push(fakeFileList[i]);
                    state.image.push({
                        uid: fakeFileList[i].uid,
                        url: `/images/products/${newName}`,
                        data: fakeFileList[i],
                        file: fakeFileList[i].originFileObj,
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
                            url: `/images/products/${newName}`,
                            data: fakeFileList[i],
                            file: fakeFileList[i].originFileObj,
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
        onChange: async (file) => {
            let data = [];
            for (let i = 0; i < file.fileList.length; i++) {
                let tmp = {
                    ...file.fileList[i],
                    status: "done",
                };
                data.push(tmp);
            }
            await setFakeFileList(data);
        },
    };
    const handleCancel = () => setPreviewVisible(false);
    const handlePreviewImage = async (file) => {
        if (!file.thumbUrl && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewVisible(true);
        setPreviewImage(file.thumbUrl || file.preview);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1));
    };
    const moveImage = (dragIndex, hoverIndex) => {
        const draggedImage = fileList[dragIndex];
        setFileList(
            update(fileList, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, draggedImage],
                ],
            })
        );
    };
    const handleDeleteImage = (id) => {
        let file = fileList.filter((el) => el.uid !== id);
        let fileState = state.image.filter((el) => el.uid !== id);
        setFileList([...file]);
        setState({
            ...state,
            image: fileState,
        });
    };
    const handleDeleteDesign = (name) => {
        let design = variant.filter((el) => el.name === name);
        let index = variant.findIndex((el) => el.name === name);
        design[0].image = { url: "", data: [] };
        variant[index] = design[0];
        setVariant([...variant]);
    };
    const handleAddOption = (e) => {
        if (options.filter((el) => el.id === 3).length > 0)
            return setOptions([
                ...options,
                {
                    id: 2,
                    variant: "",
                    nameVariant: "option2",
                },
            ]);
        return setOptions([
            ...options,
            {
                id: options.length + 1,
                variant: "",
                nameVariant: "option" + (options.length + 1),
            },
        ]);
    };
    const handleRemoveOption = (id, name) => {
        let newRow = options.filter((el) => el.id !== id);
        setOptions(newRow);
        if (name === "option2") return setOption2([]);
        if (name === "option3") return setOption3([]);
    };
    const handleDataVariant = () => {
        let data = [];
        if (option1.length > 0) {
            for (let i = 0; i < option1.length; i++) {
                if (option2.length > 0) {
                    for (let j = 0; j < option2.length; j++) {
                        if (option3.length > 0) {
                            for (let k = 0; k < option3.length; k++) {
                                let tmp = {
                                    variant: option1[i].variant + "-" + option2[j].variant + "-" + option3[k].variant,
                                    name: option1[i].name + "/" + option2[j].name + "/" + option3[k].name,
                                    sku:
                                        (option1[i].name + "-" + option2[j].name + "-" + option3[k].name).toUpperCase() +
                                        "-" +
                                        randomString,
                                    baseCost: "",
                                    salePrice: [
                                        { level: "vip1", price: "" },
                                        { level: "vip2", price: "" },
                                        { level: "vip3", price: "" },
                                        { level: "vip4", price: "" },
                                    ],
                                    image: { url: "", data: [] },
                                    variantAmazone: {
                                        variant: {
                                            size:
                                                option1[i].variant === "Size"
                                                    ? option1[i].name
                                                    : option2[j].variant === "Size"
                                                    ? option2[j].name
                                                    : option3[k].variant === "Size"
                                                    ? option3[k].name
                                                    : "",
                                            color:
                                                option1[i].variant === "Color"
                                                    ? option1[i].name
                                                    : option2[j].variant === "Color"
                                                    ? option2[j].name
                                                    : option3[k].variant === "Color"
                                                    ? option3[k].name
                                                    : "",
                                            title:
                                                option1[i].variant === "Title"
                                                    ? option1[i].name
                                                    : option2[j].variant === "Title"
                                                    ? option2[j].name
                                                    : option3[k].variant === "Title"
                                                    ? option3[k].name
                                                    : "",
                                            material:
                                                option1[i].variant === "Material"
                                                    ? option1[i].name
                                                    : option2[j].variant === "Material"
                                                    ? option2[j].name
                                                    : option3[k].variant === "Material"
                                                    ? option3[k].name
                                                    : "",
                                            style:
                                                option1[i].variant === "Style"
                                                    ? option1[i].name
                                                    : option2[j].variant === "Style"
                                                    ? option2[j].name
                                                    : option3[k].variant === "Style"
                                                    ? option3[k].name
                                                    : "",
                                        },
                                    },
                                };
                                if (variant.find((el) => el.name === tmp.name) !== undefined)
                                    data.push(variant.filter((el) => el.name === tmp.name)[0]);
                                else data.push(tmp);
                            }
                            setVariant(data);
                        } else {
                            let tmp = {
                                variant: option1[i].variant + "-" + option2[j].variant,
                                name: option1[i].name + "/" + option2[j].name,
                                sku: (option1[i].name + "-" + option2[j].name).toUpperCase() + "-" + randomString,
                                baseCost: "",
                                salePrice: [
                                    { level: "vip1", price: "" },
                                    { level: "vip2", price: "" },
                                    { level: "vip3", price: "" },
                                    { level: "vip4", price: "" },
                                ],
                                image: { url: "", data: [] },
                                variantAmazone: {
                                    variant: {
                                        size:
                                            option1[i].variant === "Size"
                                                ? option1[i].name
                                                : option2[j].variant === "Size"
                                                ? option2[j].name
                                                : "",
                                        color:
                                            option1[i].variant === "Color"
                                                ? option1[i].name
                                                : option2[j].variant === "Color"
                                                ? option2[j].name
                                                : "",
                                        title:
                                            option1[i].variant === "Title"
                                                ? option1[i].name
                                                : option2[j].variant === "Title"
                                                ? option2[j].name
                                                : "",
                                        material:
                                            option1[i].variant === "Material"
                                                ? option1[i].name
                                                : option2[j].variant === "Material"
                                                ? option2[j].name
                                                : "",
                                        style:
                                            option1[i].variant === "Style"
                                                ? option1[i].name
                                                : option2[j].variant === "Style"
                                                ? option2[j].name
                                                : "",
                                    },
                                },
                            };
                            if (variant.find((el) => el.name === tmp.name) !== undefined)
                                data.push(variant.filter((el) => el.name === tmp.name)[0]);
                            else data.push(tmp);
                        }
                    }
                    setVariant(data);
                } else if (option3.length > 0) {
                    for (let k = 0; k < option3.length; k++) {
                        let tmp = {
                            variant: option1[i].variant + "-" + option3[k].variant,
                            name: option1[i].name + "/" + option3[k].name,
                            sku: (option1[i].name + "-" + option3[k].name).toUpperCase() + "-" + randomString,
                            baseCost: "",
                            salePrice: [
                                { level: "vip1", price: "" },
                                { level: "vip2", price: "" },
                                { level: "vip3", price: "" },
                                { level: "vip4", price: "" },
                            ],
                            image: { url: "", data: [] },
                            variantAmazone: {
                                variant: {
                                    size:
                                        option1[i].variant === "Size"
                                            ? option1[i].name
                                            : option3[k].variant === "Size"
                                            ? option3[k].name
                                            : "",
                                    color:
                                        option1[i].variant === "Color"
                                            ? option1[i].name
                                            : option3[k].variant === "Color"
                                            ? option3[k].name
                                            : "",
                                    title:
                                        option1[i].variant === "Title"
                                            ? option1[i].name
                                            : option3[k].variant === "Title"
                                            ? option3[k].name
                                            : "",
                                    material:
                                        option1[i].variant === "Material"
                                            ? option1[i].name
                                            : option3[k].variant === "Material"
                                            ? option3[k].name
                                            : "",
                                    style:
                                        option1[i].variant === "Style"
                                            ? option1[i].name
                                            : option3[k].variant === "Style"
                                            ? option3[k].name
                                            : "",
                                },
                            },
                        };
                        if (variant.find((el) => el.name === tmp.name) !== undefined)
                            data.push(variant.filter((el) => el.name === tmp.name)[0]);
                        else data.push(tmp);
                    }
                    setVariant(data);
                } else {
                    if (variant.find((el) => el.name === option1[i].name) !== undefined)
                        data.push(variant.filter((el) => el.name === option1[i].name)[0]);
                    else data.push(option1[i]);
                    setVariant(data);
                }
            }
        }
    };
    const handleChangeVariant = (e, name, variantName) => {
        let data = [];
        if (name === "option1") {
            if (e.length === 0) setVariant(e);
            else {
                for (let i = 0; i < e.length; i++) {
                    if (variant.find((el) => el.name === e[i].label) !== undefined) {
                        data.push(variant.filter((el) => el.name === e[i].label)[0]);
                    } else {
                        const tmp = {
                            variant: variantName,
                            name: e[i].label,
                            sku: e[i].label.toUpperCase() + "-" + randomString + "-" + dataUser.id,
                            baseCost: "",
                            salePrice: [
                                { level: "vip1", price: "" },
                                { level: "vip2", price: "" },
                                { level: "vip3", price: "" },
                                { level: "vip4", price: "" },
                            ],
                            image: { url: "", data: [] },
                            variantAmazon: {
                                variant: {
                                    size: variantName === "Size" ? e[i].label : "",
                                    color: variantName === "Color" ? e[i].label : "",
                                    title: variantName === "Title" ? e[i].label : "",
                                    material: variantName === "Material" ? e[i].label : "",
                                    style: variantName === "Style" ? e[i].label : "",
                                },
                            },
                        };
                        data.push(tmp);
                    }
                }
                setOption1(data);
            }
        }
        if (name === "option2") {
            if (e.length === 0) setOption2(e);
            else {
                for (let i = 0; i < e.length; i++) {
                    const tmp = {
                        variant: variantName,
                        name: e[i].label,
                        sku: e[i].label.toUpperCase() + "-" + randomString,
                    };
                    data.push(tmp);
                }
                setOption2(data);
            }
        }
        if (name === "option3") {
            if (e.length === 0) setOption3(e);
            else {
                for (let i = 0; i < e.length; i++) {
                    const tmp = {
                        variant: variantName,
                        name: e[i].label,
                        sku: e[i].label.toUpperCase() + "-" + randomString,
                    };
                    data.push(tmp);
                }
                setOption3(data);
            }
        }
    };

    const getRandomString = () => {
        if (randomString !== "") return;
        let randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return setRandomString(result.toUpperCase());
    };

    const handleChange = (e) => {
        if (e.dbType) {
            if (e.dbType === "supplier") {
                return setState({
                    ...state,
                    supplier: e.id,
                    supplierName: e.label.split("-")[0].toUpperCase(),
                    sku: `${e.label.split("-")[0].toUpperCase() + "-" + state.proCode}`,
                });
            }
            return setState({ ...state, category: e.id });
        }
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
                sku: `${state.supplierName + "-" + e.target.value.toUpperCase()}`,
            });
        return setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitImage = (type) => {
        if (type === "variant") {
            let variantArr = [];
            let formData = new FormData();
            for (let i = 0; i < variant.length; i++) {
                let fileType = variant[i].image.file.name.split(".").pop();
                let fileName = variant[i].image.file.name.split(".").shift();
                let newName = fileName + "-" + Date.now() + "." + fileType;
                formData.append("data", variant[i].image.file, newName);
                let tmp = {
                    option: variant[i].variant,
                    title: variant[i].name,
                    salePrice: variant[i].salePrice,
                    baseCost: variant[i].baseCost,
                    sku: state.sku + "-" + variant[i].sku,
                    image: `/images/product_type/${newName}`,
                    data: variant[i].image.data[0],
                };
                variantArr.push(tmp);
            }
            uploadProductTypeImage(formData);
            return variantArr;
        } else {
            let imageArr = [];
            let formData = new FormData();
            for (let i = 0; i < state.image.length; i++) {
                let fileType = state.image[i].file.name.split(".").pop();
                let fileName = state.image[i].file.name.split(".").shift();
                let newName = fileName + "-" + Date.now() + "." + fileType;
                formData.append("data", state.image[i].file, newName);
                let tmp = {
                    url: `/images/product_type/${newName}`,
                    data: state.image[i].data,
                };
                imageArr.push(tmp);
            }
            uploadProductTypeImage(formData);
            return imageArr;
        }
    };
    const handleSubmit = async () => {
        setLoadingSubmit(true);
        let imageArr = [];
        let variantArr = [];
        let carrierArr = [];
        variantArr = await handleSubmitImage("variant");
        imageArr = await handleSubmitImage("state");
        for (let i = 0; i < carrier.length; i++) {
            carrierArr.push(carrier[i].id);
        }
        let optionStr = JSON.stringify(options.map((item) => item.variant));
        let printFileStr = JSON.stringify(printFile);
        let bulletPrintStr = JSON.stringify(bulletPrint);
        let carrierIdStr = JSON.stringify(carrierArr);

        let request = {
            ...state,
            image: imageArr,
            variant: variantArr,
            option: optionStr,
            printFile: printFileStr,
            bulletPrint: bulletPrintStr,
            carrierInfo: carrierIdStr,
            salePrice: JSON.stringify(state.salePrice),
        };
        addNewProductType(request)
            .then((res) => {
                toast.success("Insert successfully!");
                setLoadingSubmit(false);
                props.history.push("/products/product-type");
            })
            .catch((err) => toast.error(err));
    };
    const handleAddRow = () => {
        for (let i = 1; i <= printFile.length; i++) {
            if (printFile.find((el) => el.id === i) !== undefined && i !== printFile.length) continue;
            if (printFile.find((el) => el.id === i) !== undefined && i === printFile.length) {
                setPrintFile([
                    ...printFile,
                    {
                        id: printFile.length + 1,
                        namePrint: "",
                        notePrint: "",
                    },
                ]);
                break;
            }
            if (printFile.find((el) => el.id === i) === undefined) {
                setPrintFile([
                    ...printFile,
                    {
                        id: i,
                        namePrint: "",
                        notePrint: "",
                    },
                ]);
                break;
            }
        }
    };

    const handleDeleteRow = (id) => {
        let newRow = printFile.filter((el) => el.id !== id);
        setPrintFile(newRow);
    };

    const handleOnChangeRow = (e, id) => {
        let tmp = printFile.find((el) => el.id === id);
        let index = printFile.findIndex((el) => el.id === id);
        tmp = {
            ...tmp,
            [e.target.name]: e.target.value,
        };
        printFile[index] = tmp;
        setPrintFile([...printFile]);
    };

    const handleOpenDialog = (type) => {
        if (type === "supplier") return setOpenDialog({ ...openDialog, supplier: true });
        if (type === "carrier") return setOpenDialog({ ...openDialog, carrier: true });
        return setOpenDialog({ ...openDialog, category: true });
    };

    const handleCloseDialog = (type) => {
        if (type === "supplier") return setOpenDialog({ ...openDialog, supplier: false });
        if (type === "carrier") return setOpenDialog({ ...openDialog, carrier: false });
        return setOpenDialog({ ...openDialog, category: false });
    };

    const handleAddBullet = () => {
        for (let i = 1; i <= bulletPrint.length; i++) {
            if (bulletPrint.find((el) => el.id === i) !== undefined && i !== bulletPrint.length) continue;
            if (bulletPrint.find((el) => el.id === i) !== undefined && i === bulletPrint.length) {
                setBulletPrint([
                    ...bulletPrint,
                    {
                        id: bulletPrint.length + 1,
                        content: "",
                    },
                ]);
                break;
            }
            if (bulletPrint.find((el) => el.id === i) === undefined) {
                setBulletPrint([
                    ...bulletPrint,
                    {
                        id: i,
                        content: "",
                    },
                ]);
                break;
            }
        }
    };

    const handleRemoveBullet = (id) => {
        let newBullet = bulletPrint.filter((el) => el.id !== id);
        setBulletPrint(newBullet);
    };

    const updateData = async () => {
        await getListSupplier().then((res) => setSuppliers(res.data.data));
        await getListCategory().then((res) => setCategories(res.data.data));
        await getListCarrier().then((res) => setCarrier(res.data.data));
        setOpenDialog(false);
    };

    const columns = [
        {
            title: "Variants",
            align: "center",
            cellStyle: {
                padding: 8,
                width: 100,
            },
            headerStyle: {
                width: 100,
            },
            render: (rowData) => <Typography variant="body2">{rowData.name}</Typography>,
        },
        {
            title: "ASIN / SKU",
            align: "center",
            cellStyle: {
                maxWidth: 100,
            },
            headerStyle: {
                width: 100,
            },
            render: (rowData) => (
                <Typography
                    name="sku"
                    variant="body2"
                    style={{
                        backgroundColor: "#ff8e4d",
                        color: "#fff",
                    }}
                >
                    {state.sku.length > 0 ? state.sku + "-" + rowData.sku : rowData.sku}
                </Typography>
            ),
        },
        {
            title: "Base cost",
            align: "center",
            cellStyle: {
                maxWidth: 40,
            },
            headerStyle: {
                width: 40,
            },
            render: (rowData) => (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextValidator
                            className="w-100"
                            label="Base cost"
                            name="baseCost"
                            variant="outlined"
                            value={rowData.baseCost ? rowData.baseCost : ""}
                            onChange={(e) =>
                                setVariant(
                                    [...variant].map((item) => {
                                        if (item.name === rowData.name) return { ...item, baseCost: e.target.value };
                                        return item;
                                    })
                                )
                            }
                            size="small"
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            required
                        />
                    </Grid>
                </Grid>
            ),
        },
        {
            title: "Sale price",
            align: "center",
            width: "100%",
            cellStyle: {
                maxWidth: 150,
            },
            headerStyle: {
                width: 150,
            },
            render: (rowData) => (
                <Grid container spacing={2}>
                    {rowData.salePrice.map((el) => (
                        <Grid item xs={6}>
                            <TextValidator
                                className="w-100"
                                label={el.level.toUpperCase()}
                                name="salePrice"
                                variant="outlined"
                                value={el.price ? el.price : ""}
                                min="0"
                                step="0.0001"
                                pattern="^\d+(?:\.\d{1,4})?$"
                                onChange={(e) =>
                                    setVariant(
                                        [...variant].map((item) => {
                                            if (item.name === rowData.name)
                                                return {
                                                    ...item,
                                                    salePrice: item.salePrice.map((price) => {
                                                        if (price.level === el.level) return { ...price, price: e.target.value };
                                                        return price;
                                                    }),
                                                };
                                            return item;
                                        })
                                    )
                                }
                                size="small"
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                required
                            />
                        </Grid>
                    ))}
                </Grid>
            ),
        },
        {
            title: "Media",
            align: "center",
            cellStyle: {
                width: 150,
                height: 150,
            },
            headerStyle: {
                width: 50,
            },
            render: (rowData) => (
                <Fragment>
                    {variant.find((el) => el.name === rowData.name).image.url === "" ? (
                        <Dragger
                            name="file"
                            accept="image/*"
                            showUploadList={false}
                            className="dropzone-mini"
                            customRequest={(file) => {
                                let fileType = file.file.name.split(".").pop();
                                let fileName = file.file.name.split(".").shift();
                                let newName = fileName + "-" + Date.now() + "." + fileType;
                                const lengthFDesign = fakeDesign.length;
                                const tmpObj = {};
                                for (let i = 0; i < lengthFDesign; i++) {
                                    Object.assign(tmpObj, {
                                        url: `/images/products/${newName}`,
                                        data: [fakeDesign[i]],
                                        file: file.file,
                                    });
                                }
                                setVariant(
                                    [...variant].map((item) => {
                                        if (item.name === rowData.name)
                                            return {
                                                ...item,
                                                image: tmpObj,
                                            };
                                        return item;
                                    })
                                );
                            }}
                            onChange={(file) => {
                                let data = [];
                                for (let i = 0; i < file.fileList.length; i++) {
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
                        <div className="upload-design">
                            <Upload
                                listType="picture-card"
                                disabled={true}
                                fileList={variant.find((el) => el.name === rowData.name).image.data}
                                onChange={handleChange}
                                itemRender={(originNode, file) => (
                                    <div className="ant-upload-item">
                                        <Tooltip title="Delete" placement="top" arrow>
                                            <IconButton className="delete-image" onClick={() => handleDeleteDesign(rowData.name)}>
                                                <i className="feather icon-trash-2" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Preview" placement="top" arrow>
                                            <IconButton className="preview-image" onClick={() => handlePreviewImage(file)}>
                                                <i className="feather icon-eye" />
                                            </IconButton>
                                        </Tooltip>
                                        {originNode}
                                    </div>
                                )}
                            />
                            <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                                <img alt="example" style={{ width: "100%" }} src={previewImage} />
                            </Modal>
                        </div>
                    )}
                </Fragment>
            ),
        },
    ];

    useEffect(() => {
        updateData();
        getRandomString();
        document.title = "Product Type | Printway";
    }, []);

    useEffect(() => {
        handleDataVariant();
    }, [option1, option2, option3]);
    useEffect(() => {
        console.log(variant);
    }, [variant]);

    return (
        <>
            {loadingSubmit ? (
                <div
                    style={{
                        position: "fixed",
                        zIndex: 999999,
                        width: "100%",
                        height: "100vh",
                        backgroundColor: "#00000066",
                        top: 0,
                        left: 0,
                    }}
                >
                    <CircularProgress
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            color: "#ff5f02",
                        }}
                    />
                </div>
            ) : null}
            <ValidatorForm onSubmit={handleSubmit} onError={(errors) => toast.error(errors)}>
                <Grid container spacing={2}>
                    <Grid item lg={7} sm={12}>
                        <Card>
                            <CardHeader title="Name" />
                            <CardContent>
                                <TextValidator
                                    className="w-100"
                                    onChange={handleChange}
                                    name="name"
                                    value={state.name}
                                    variant="outlined"
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                    size="small"
                                    required
                                    placeholder="Example: Organic apples"
                                />
                            </CardContent>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader title="Description" />
                            <CardContent>
                                <CKEditor
                                    editor={Editor}
                                    config={{
                                        toolbar: {
                                            items: [
                                                "heading",
                                                "|",
                                                "bold",
                                                "italic",
                                                "underline",
                                                "bulletedList",
                                                "numberedList",
                                                "|",
                                                "fontSize",
                                                "fontColor",
                                                "fontFamily",
                                                "highlight",
                                                "alignment",
                                                "outdent",
                                                "indent",
                                                "|",
                                                "imageUpload",
                                                "link",
                                                "insertTable",
                                                "mediaEmbed",
                                                "undo",
                                                "redo",
                                                "blockQuote",
                                            ],
                                        },
                                        image: {
                                            toolbar: ["imageTextAlternative", "imageStyle:full", "imageStyle:side"],
                                        },
                                        table: {
                                            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
                                        },
                                        ckfinder: {
                                            uploadUrl: "/api/uploadImage",
                                        },
                                    }}
                                    data={state.des}
                                    onChange={(e, editor) => {
                                        const data = editor.getData();
                                        handleChange(data);
                                    }}
                                />
                            </CardContent>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader title="Mockup" />
                            <CardContent>
                                {fileList.length === 0 ? (
                                    <Dragger {...prop}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drop file to this area to upload (Max: 20)</p>
                                    </Dragger>
                                ) : (
                                    <DndProvider backend={backendForDND}>
                                        <Upload
                                            listType="picture-card"
                                            disabled={true}
                                            fileList={fileList}
                                            itemRender={(originNode, file, currFileList) => (
                                                <DragableUploadListItem
                                                    originNode={originNode}
                                                    file={file}
                                                    fileList={currFileList}
                                                    moveImage={moveImage}
                                                    handleDeleteImage={handleDeleteImage}
                                                    handlePreviewImage={handlePreviewImage}
                                                />
                                            )}
                                        >
                                            <Dragger {...prop} className="dropzone-mini">
                                                Click or drop files to upload (Max: 20)
                                            </Dragger>
                                        </Upload>
                                        <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                                            <img alt="example" style={{ width: "100%" }} src={previewImage} />
                                        </Modal>
                                    </DndProvider>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader
                                title="Print file"
                                action={
                                    <Button variant="outline-primary" size="sm" onClick={handleAddRow}>
                                        <AddIcon />
                                        Add row
                                    </Button>
                                }
                            />
                            <CardContent>
                                {printFile.map((item) => (
                                    <Grid key={item.id} container spacing={2} className="mb-2">
                                        <Grid item xs={5}>
                                            <TextValidator
                                                className="w-100 "
                                                onChange={(e) => handleOnChangeRow(e, item.id)}
                                                label="Name"
                                                name="namePrint"
                                                value={item.namePrint}
                                                variant="outlined"
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                                size="small"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextValidator
                                                className="w-100"
                                                onChange={(e) => handleOnChangeRow(e, item.id)}
                                                label="Note"
                                                name="notePrint"
                                                value={item.notePrint}
                                                variant="outlined"
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                                size="small"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button
                                                className="w-100 d-flex justify-content-center"
                                                variant={item.id === 1 ? "outline-secondary" : "outline-danger"}
                                                size="sm"
                                                disabled={item.id === 1 ? true : false}
                                                onClick={() => handleDeleteRow(item.id)}
                                            >
                                                <HighlightOffIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="mt-3 mb-3">
                            <CardHeader
                                title="Variant"
                                action={
                                    options.length < 3 ? (
                                        <Button variant="outline-primary" size="sm" onClick={handleAddOption}>
                                            <AddIcon />
                                            Add option
                                        </Button>
                                    ) : null
                                }
                            />
                            <CardContent>
                                {options.map((item) => (
                                    <Grid container spacing={2} key={item.id} className="mb-2">
                                        <Grid item xs={5}>
                                            <Select
                                                options={typeOptions}
                                                onChange={(e) => {
                                                    setOptions(
                                                        [...options].map((el) => {
                                                            if (el.nameVariant === item.nameVariant) return { ...el, variant: e.label };
                                                            return el;
                                                        })
                                                    );
                                                }}
                                                isSearchable={true}
                                            />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <CreatableSelect
                                                isMulti
                                                isClearable={false}
                                                components={makeAnimated()}
                                                onChange={(e) => handleChangeVariant(e, item.nameVariant, item.variant)}
                                                placeholder="Enter options..."
                                                isDisabled={item.variant ? false : true}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Button
                                                className="w-100 d-flex justify-content-center"
                                                variant={item.id === 1 ? "outline-secondary" : "outline-danger"}
                                                size="sm"
                                                disabled={item.id === 1 ? true : false}
                                                onClick={() => handleRemoveOption(item.id, item.nameVariant)}
                                            >
                                                <HighlightOffIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ))}
                                <MaterialTable
                                    title={
                                        <Typography
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: 600,
                                                color: "#505050",
                                            }}
                                        >
                                            Preview
                                        </Typography>
                                    }
                                    data={variant}
                                    columns={columns}
                                    options={{
                                        headerStyle: {
                                            backgroundColor: "#fafafa",
                                            color: "#000000d9",
                                            fontWeight: "600",
                                            whiteSpace: "nowrap",
                                            zIndex: 5,
                                        },
                                        minBodyHeight: 0,
                                        sorting: false,
                                        selection: true,
                                        paging: false,
                                        draggable: false,
                                        search: false,
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item lg={5} sm={12}>
                        <Card>
                            <CardHeader
                                title="Supplier"
                                action={
                                    <Button variant="outline-primary" size="sm" onClick={() => handleOpenDialog("supplier")}>
                                        <AddIcon />
                                        Add supplier
                                    </Button>
                                }
                            />
                            {openDialog.supplier && (
                                <DialogAddNew
                                    close={() => handleCloseDialog("supplier")}
                                    open={openDialog.supplier}
                                    type="supplier"
                                    update={() => updateData()}
                                />
                            )}
                            <CardContent>
                                <Select
                                    options={suppliers}
                                    isSearchable={true}
                                    defaultValue
                                    onChange={handleChange}
                                    placeholder="Select supplier..."
                                    // menuIsOpen={true}
                                />
                            </CardContent>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader
                                title="Category"
                                action={
                                    <Button variant="outline-primary" size="sm" onClick={() => handleOpenDialog("category")}>
                                        <AddIcon />
                                        Add category
                                    </Button>
                                }
                            />
                            {openDialog.category && (
                                <DialogAddNew
                                    close={() => handleCloseDialog("category")}
                                    open={openDialog.category}
                                    type="category"
                                    update={() => updateData()}
                                />
                            )}
                            <CardContent>
                                <Select
                                    options={categories}
                                    onChange={handleChange}
                                    placeholder="Select category..."
                                    isSearchable={true}
                                    defaultValue
                                />
                            </CardContent>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader
                                title="Carrier"
                                action={
                                    <Button variant="outline-primary" size="sm" onClick={() => handleOpenDialog("carrier")}>
                                        <AddIcon />
                                        Add carrier
                                    </Button>
                                }
                            />
                            {openDialog.carrier && (
                                <DialogAddNew
                                    close={() => handleCloseDialog("carrier")}
                                    open={openDialog.carrier}
                                    type="carrier"
                                    update={() => updateData()}
                                />
                            )}
                            <CardContent>
                                <Select
                                    options={carrier}
                                    isMulti
                                    onChange={handleChange}
                                    placeholder="Select carrier..."
                                    isSearchable={true}
                                    defaultValue
                                />
                            </CardContent>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader title="Pricing" />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextValidator
                                            className="w-100"
                                            onChange={handleChange}
                                            label="Base cost"
                                            name="baseCost"
                                            type="number"
                                            value={state.baseCost}
                                            variant="outlined"
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                            size="small"
                                            required
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography
                                            variant="body2"
                                            style={{
                                                fontWeight: 600,
                                                color: "#505050",
                                            }}
                                        >
                                            Sale price
                                        </Typography>
                                    </Grid>
                                    {state.salePrice.map((item) => (
                                        <Grid key={item.level} item xs={3}>
                                            <TextValidator
                                                className="w-100"
                                                onChange={(e) =>
                                                    setState({
                                                        ...state,
                                                        salePrice: state.salePrice.map((el) => {
                                                            if (el.level === item.level) return { ...el, price: e.target.value };
                                                            return el;
                                                        }),
                                                    })
                                                }
                                                label={item.level.toUpperCase()}
                                                name="salePrice"
                                                type="number"
                                                value={item.price}
                                                variant="outlined"
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                                size="small"
                                                required
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader title="Processing time" />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextValidator
                                            className="w-100"
                                            onChange={handleChange}
                                            label="Shipping time"
                                            name="timeShip"
                                            value={state.timeShip}
                                            variant="outlined"
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                            size="small"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextValidator
                                            className="w-100"
                                            onChange={handleChange}
                                            label="Processing time"
                                            name="timeProcess"
                                            value={state.timeProcess}
                                            variant="outlined"
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                            size="small"
                                            required
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        <Card className="mt-3">
                            <CardHeader title="Inventory" />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextValidator
                                            className="w-100"
                                            onChange={handleChange}
                                            label="Product code"
                                            name="proCode"
                                            value={state.proCode}
                                            variant="outlined"
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                            size="small"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextValidator
                                            className="w-100"
                                            label="SKU (Stock Keeping Unit)"
                                            name="sku"
                                            disabled
                                            value={state.sku}
                                            variant="outlined"
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                        {bulletPrint.map((item) => (
                            <Card key={item.id} className="mt-3">
                                <CardHeader
                                    title="Bullet point"
                                    action={
                                        item.id === 1 ? (
                                            <Button variant="outline-primary" size="sm" onClick={handleAddBullet}>
                                                <AddIcon />
                                                Add bullet
                                            </Button>
                                        ) : (
                                            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveBullet(item.id)}>
                                                <HighlightOffIcon />
                                                Remove bullet
                                            </Button>
                                        )
                                    }
                                />
                                <CardContent>
                                    <CKEditor
                                        editor={Editor}
                                        config={{
                                            toolbar: {
                                                items: ["bold", "italic", "underline", "bulletedList", "numberedList", "undo"],
                                            },
                                        }}
                                        data={item.content}
                                        onChange={(e, editor) => {
                                            const data = editor.getData();
                                            let tmp = bulletPrint.find((el) => el.id === item.id);
                                            let index = bulletPrint.findIndex((el) => el.id === item.id);
                                            tmp = {
                                                ...tmp,
                                                content: data,
                                            };
                                            bulletPrint[index] = tmp;
                                            setBulletPrint([...bulletPrint]);
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                </Grid>
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
                            onClick={() => props.history.push("/products/product-type")}
                        >
                            <ArrowBackIcon />
                            Back
                        </Button>
                        <Button
                            className=" mb-0"
                            variant="primary"
                            size="sm"
                            // onClick={handleSubmit}
                            type="submit"
                            disabled={
                                !state.des |
                                (state.image.length === 0) |
                                (state.carrierId.length === 0) |
                                !state.supplier |
                                !state.category |
                                (bulletPrint.find((el) => !el.content) !== undefined) |
                                (printFile.find((el) => !el.namePrint | !el.notePrint) !== undefined) |
                                (variant.length === 0) |
                                (variant.find((el) => !el.baseCost | !el.image | !el.image.url | !el.salePrice) !== undefined)
                                    ? true
                                    : false
                            }
                        >
                            <SaveIcon />
                            Save
                        </Button>
                    </Toolbar>
                </AppBar>
            </ValidatorForm>
        </>
    );
};

export default ProductTypeAddNew;

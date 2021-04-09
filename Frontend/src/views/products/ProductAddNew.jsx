import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
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
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
} from "@material-ui/core";
import { Button } from "react-bootstrap";
import { Checkbox } from "antd";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { uploadProductImage, addNewProduct, getCarrierById, getSaleChannel } from "./ProductService";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { toast } from "react-toastify";
import { Upload, Modal } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import update from "immutability-helper";
import { isTouchDevice } from "../../utils";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { Switch } from "antd";
import MaterialTable from "material-table";

toast.configure({
    limit: 3,
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
        <div ref={ref} className={"ant-upload-draggable-list-item"} style={{ cursor: "move", opacity: isDragging ? 0 : 1 }}>
            <Tooltip title="Delete" placement="top" arrow>
                <IconButton className="delete-image" onClick={() => handleDeleteImage(file.uid, file.name)}>
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

const ProductAddNew = (props) => {
    const { dataCampaign, updateTable } = props;

    const dataUser = useSelector((state) => state.user.dataUser[0]);

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState([]);
    const [fakeFileList, setFakeFileList] = useState([]);
    const [carrier, setCarrier] = useState([]);
    const [fakeDesign, setFakeDesign] = useState([]);
    const [fakePrint, setFakePrint] = useState([]);
    const [checkedVariant, setCheckedVariant] = useState(false);
    const [bulletPrint, setBulletPrint] = useState([]);
    const [saleChannel, setSaleChannel] = useState([]);
    const [printFile, setPrintFile] = useState([
        {
            id: 1,
            namePrint: "",
            notePrint: "",
            image: "",
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

    const [state, setState] = useState({
        name: "",
        image: dataCampaign.prod_image,
        baseCost: "",
        dateTimeCreate: dateTime,
        dateTimeUpdate: dateTime,
        des: "",
        timeShip: "",
        timeProcess: "",
        sku: "",
        salePrice: "",
        regularPrice: "",
        carrierId: "",
        saleChannel: [],
    });

    // const options = [
    //     { label: "chipchipglobal2", value: "1" },
    //     { label: "paginate", value: "4" },
    //     { label: "printway-test2", value: "12" },
    //     { label: "pw-test1", value: "11" },
    //     { label: "printway-test3", value: "13" },
    // ];

    const { Dragger } = Upload;
    const prop = {
        name: "file",
        accept: "image/*",
        multiple: true,
        showUploadList: false,
        maxCount: 20,
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
                        url: `/images/products/${newName}`,
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
                            url: `/images/products/${newName}`,
                            data: fakeFileList[i],
                            file: file.file,
                        });
                        break;
                    }
                }
            }
            await setFileList([...fileList]);
            await setState({
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
    const handleDeleteImage = (id, name) => {
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
    const handleChangeCustomVariant = (e) => {
        setCheckedVariant(e);
    };
    const handleChangeVariant = (e, id) => {
        return setOptions(
            [...options].map((item) => {
                if (item.id === id) return { ...item, name: e.target.value };
                return item;
            })
        );
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

        if (typeof e === typeof "")
            return setState({
                ...state,
                des: e,
            });

        if (e.target.name === "proCode")
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
            let flag = false;
            for (let i = 0; i < variant.length; i++) {
                if (variant[i].image.file === undefined) {
                    variantArr.push(variant[i]);
                    continue;
                }
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
                flag = true;
            }
            if (flag === true) uploadProductImage(formData);
            return variantArr;
        } else {
            let imageArr = [];
            let formData = new FormData();
            let flag = false;
            for (let i = 0; i < state.image.length; i++) {
                if (state.image[i].file === undefined) {
                    imageArr.push(state.image[i]);
                    continue;
                }
                let fileType = state.image[i].file.name.split(".").pop();
                let fileName = state.image[i].file.name.split(".").shift();
                let newName = fileName + "-" + Date.now() + "." + fileType;
                formData.append("data", state.image[i].file, newName);
                let tmp = {
                    url: `/images/product_type/${newName}`,
                    data: state.image[i].data,
                };
                imageArr.push(tmp);
                flag = true;
            }
            if (flag === true) uploadProductImage(formData);
            return imageArr;
        }
    };

    const handleSubmit = async () => {
        setLoadingSubmit(true);
        let imageArr = [];
        let variantArr = [];
        variantArr = await handleSubmitImage("variant");
        imageArr = await handleSubmitImage("state");
        let bulletPrintStr = JSON.stringify(bulletPrint);
        // let variantObj = {
        //     variant: {
        //         size: option.includes("Size") ? ""
        //     },
        // };
        let request = {
            ...state,
            image: imageArr,
            variant: variantArr,
            printFile: printFile,
            bulletPrint: bulletPrintStr,
            salePrice: JSON.stringify(state.salePrice),
            productTypeId: dataCampaign.id,
        };
        console.log(request);
        // await addNewProduct(request)
        //     .then((res) => {
        //         setLoadingSubmit(false);
        //         toast.success("Insert successfully!");
        //         props.history.push("/products/product-type");
        //     })
        //     .catch((err) => toast.error(err));
    };

    const handleAddRow = () => {
        if (printFile.length === 0) {
            return setPrintFile([
                {
                    id: printFile.length + 1,
                    name: "",
                    note: "",
                },
                {
                    id: printFile.length + 2,
                    name: "",
                    note: "",
                },
            ]);
        }
        setPrintFile([
            ...printFile,
            {
                id: printFile.length + 1,
                name: "",
                note: "",
            },
        ]);
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

    const handleDeleteRow = (id) => {
        let newRow = printFile.filter((el) => el.id !== id);
        setPrintFile(newRow);
    };

    const handleAddBullet = () => {
        setBulletPrint([
            ...bulletPrint,
            {
                id: bulletPrint.length + 1,
            },
        ]);
    };

    const handleRemoveBullet = (id) => {
        let remove = bulletPrint.filter((el) => el.id !== id);
        setBulletPrint(remove);
    };

    const updateData = async () => {
        let prioritizeArr = [];
        let imageList = [];
        let dataBulletPoint = [];
        let dataVariantTmp = [];
        let dataBaseCost = dataCampaign.pro_sale_price
            .replace("[", "")
            .replace("]", "")
            .replace(/\},\{/g, "}#{")
            .split("#")
            .map((item) => JSON.parse(item));
        let tmpBaseCost = dataBaseCost.find((el) => el.level === dataUser.user_level);
        let dataPrintFile = dataCampaign.prod_url_design_printer
            .replace("[", "")
            .replace("]", "")
            .replace(/\},\{/g, "}#{")
            .split("#")
            .map((item) => JSON.parse(item));
        if (dataCampaign.amazon_bullet_print.includes("},{") === false) {
            dataBulletPoint = dataCampaign.amazon_bullet_print.replace("[", "").replace("]", "");
            dataBulletPoint = [JSON.parse(dataBulletPoint)];
        } else
            dataBulletPoint = dataCampaign.amazon_bullet_print
                .replace("[", "")
                .replace("]", "")
                .replace(/\},\{/g, "}#{")
                .split("#")
                .map((item) => JSON.parse(item));
        let dataCarrier = dataCampaign.carrier_info
            .replace("[", "")
            .replace("]", "")
            .split(",")
            .map((item) => parseInt(item));
        let dataVariant = dataCampaign.pro_variant
            .substr(dataCampaign.pro_variant.length - (dataCampaign.pro_variant.length - 1), dataCampaign.pro_variant.length - 2)
            .replace(/\}\},\{/g, "}}#{")
            .split("#")
            .map((item) => JSON.parse(item));

        let tmpCarrier = [];
        for (let i = 0; i < dataCarrier.length; i++) {
            await getCarrierById({ id: dataCarrier[i] })
                .then((res) => {
                    let result = res.data.data;
                    let prioritize = result.filter((el) => el.priority === 1);
                    if (prioritize[0]) prioritizeArr.push(prioritize[0]);
                    tmpCarrier.push(result[0]);
                    setCarrier([...carrier, result[0]]);
                })
                .catch((err) => toast.error(err));
        }
        await getSaleChannel()
            .then((res) => setSaleChannel(res.data.data))
            .catch((err) => console.log(err));
        for (let i = 0; i < dataPrintFile.length; i++) {
            dataPrintFile[i] = { ...dataPrintFile[i], media: {} };
        }
        for (let i = 0; i < dataCampaign.prod_image.length; i++) {
            imageList.push(dataCampaign.prod_image[i].data);
        }
        for (let i = 0; i < dataVariant.length; i++) {
            let tmpBaseCostVariant = dataVariant[i].salePrice.find((el) => el.level === dataUser.user_level);
            let tmpObj = {
                ...dataVariant[i],
                baseCost: Number(tmpBaseCostVariant.price),
                salePrice: "",
                regularPrice: "",
                data: [dataVariant[i].data],
            };
            dataVariantTmp.push(tmpObj);
        }
        setVariant(dataVariantTmp);
        setFileList(imageList);
        setCarrier(tmpCarrier);
        setPrintFile(dataPrintFile);
        setState({
            ...state,
            sku: dataCampaign.pro_sku,
            baseCost: tmpBaseCost.price,
            carrierId: prioritizeArr[0].value,
            timeProcess: dataCampaign.prod_processing_time,
            timeShip: dataCampaign.prod_shipping_time,
        });
        setBulletPrint(dataBulletPoint);
        await setTimeout(() => {
            setLoading(false);
        }, 1000);
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
            render: (rowData) => <Typography variant="body2">{rowData.title}</Typography>,
        },
        {
            title: "ASIN / SKU",
            align: "center",
            width: "100%",
            render: (rowData) => (
                <Typography
                    name="sku"
                    variant="body2"
                    style={{
                        backgroundColor: "#ff8e4d",
                        color: "#fff",
                    }}
                >
                    {rowData.sku}
                </Typography>
            ),
        },
        {
            title: "Price",
            field: "price",
            align: "center",
            cellStyle: {
                maxWidth: 200,
            },
            headerStyle: {
                width: 200,
            },
            render: (rowData) => (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextValidator
                                className="w-100"
                                label="Base cost"
                                name="baseCost"
                                variant="outlined"
                                disabled
                                value={rowData.baseCost + "$"}
                                onChange={(e) =>
                                    setVariant(
                                        [...variant].map((item) => {
                                            if (item.sku === rowData.sku) return { ...item, baseCost: e.target.value };
                                            return item;
                                        })
                                    )
                                }
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            style={{
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {dataUser.user_level}
                                        </InputAdornment>
                                    ),
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextValidator
                                className="w-100"
                                label="Regular price"
                                name="regularPrice"
                                variant="outlined"
                                value={rowData.regularPrice}
                                onChange={(e) =>
                                    setVariant(
                                        [...variant].map((item) => {
                                            if (item.sku === rowData.sku) return { ...item, regularPrice: e.target.value };
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
                        <Grid item xs={4}>
                            <TextValidator
                                className="w-100"
                                label="Sale price"
                                name="salePrice"
                                variant="outlined"
                                value={rowData.salePrice}
                                onChange={(e) =>
                                    setVariant(
                                        [...variant].map((item) => {
                                            if (item.sku === rowData.sku) return { ...item, salePrice: e.target.value };
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
                </>
            ),
        },
        {
            title: "Media",
            field: "action",
            align: "center",
            cellStyle: {
                width: 150,
                height: 150,
            },
            headerStyle: {
                width: 50,
            },
            render: (rowData) => (
                <>
                    {variant.find((el) => el.sku === rowData.sku).image === "" ? (
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
                                        dataImage: [fakeDesign[i]],
                                        file: file.file,
                                        data: fakeDesign[i].originFileObj,
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
                                fileList={Object.values(variant.find((el) => el.sku === rowData.sku).data)}
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
                </>
            ),
        },
    ];

    useEffect(() => {
        updateData();
        document.title = "Product | Printway";
    }, []);
    useEffect(() => {
        console.log(state.image);
    }, [state.image]);
    return (
        <>
            {loading ? (
                <div
                    style={{
                        position: "fixed",
                        zIndex: 999999,
                        width: "100%",
                        height: "100vh",
                        backgroundColor: "#00000047",
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
            ) : (
                <>
                    {loadingSubmit ? (
                        <div
                            style={{
                                position: "fixed",
                                zIndex: 999999,
                                width: "100%",
                                height: "100vh",
                                backgroundColor: "#00000047",
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
                            <Grid item lg={8} sm={12}>
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
                                                <p className="ant-upload-text">Click or drag file to this area to upload (Max: 20)</p>
                                            </Dragger>
                                        ) : (
                                            <DndProvider backend={backendForDND}>
                                                <Upload
                                                    listType="picture-card"
                                                    disabled={true}
                                                    fileList={fileList}
                                                    onChange={handleChange}
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
                                    <CardHeader title="Print file" />
                                    <CardContent>
                                        {printFile.map((item) => (
                                            <Grid key={item.id} container spacing={2} className="mb-2" alignItems="center">
                                                <Grid item xs={2}>
                                                    {JSON.stringify(item.media) === "{}" ? (
                                                        <Dragger
                                                            name="file"
                                                            accept="image/*"
                                                            showUploadList={false}
                                                            className="dropzone-printfile"
                                                            customRequest={(file) => {
                                                                let fileType = file.file.name.split(".").pop();
                                                                let fileName = file.file.name.split(".").shift();
                                                                let newName = fileName + "-" + Date.now() + "." + fileType;
                                                                const lengthFDesign = fakePrint.length;
                                                                const tmpObj = {};
                                                                for (let i = 0; i < lengthFDesign; i++) {
                                                                    Object.assign(tmpObj, {
                                                                        url: `/images/products/${newName}`,
                                                                        dataImage: [fakePrint[i]],
                                                                        file: file.file,
                                                                        data: fakePrint[i].originFileObj,
                                                                    });
                                                                }
                                                                setPrintFile(
                                                                    [...printFile].map((el) => {
                                                                        if (el.id === item.id)
                                                                            return {
                                                                                ...el,
                                                                                media: tmpObj,
                                                                            };
                                                                        return el;
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
                                                                setFakePrint(data);
                                                            }}
                                                        >
                                                            Click or drop files to upload
                                                        </Dragger>
                                                    ) : (
                                                        <div className="upload-design">
                                                            <Upload
                                                                listType="picture-card"
                                                                disabled={true}
                                                                fileList={item.media.dataImage}
                                                                onChange={handleChange}
                                                                itemRender={(originNode, file) => (
                                                                    <div className="ant-upload-item">
                                                                        <Tooltip title="Delete" placement="top" arrow>
                                                                            <IconButton
                                                                                className="delete-image"
                                                                                onClick={() => handleDeleteDesign(item.name)}
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
                                                                )}
                                                            />
                                                            <Modal
                                                                visible={previewVisible}
                                                                title={previewTitle}
                                                                footer={null}
                                                                onCancel={handleCancel}
                                                            >
                                                                <img alt="example" style={{ width: "100%" }} src={previewImage} />
                                                            </Modal>
                                                        </div>
                                                    )}
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <TextValidator
                                                        className="w-100 mb-0"
                                                        onChange={(e) => handleOnChangeRow(e, item.id)}
                                                        label="Name"
                                                        name="namePrint"
                                                        disabled
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
                                                        className="w-100 mb-0"
                                                        onChange={(e) => handleOnChangeRow(e, item.id)}
                                                        label="Note"
                                                        name="notePrint"
                                                        disabled
                                                        value={item.notePrint}
                                                        variant="outlined"
                                                        validators={["required"]}
                                                        errorMessages={["this field is required"]}
                                                        size="small"
                                                        required
                                                    />
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </CardContent>
                                </Card>
                                <Card className="mt-3 mb-3">
                                    <CardHeader
                                        title="Variant"
                                        action={
                                            <Switch
                                                checkedChildren="Custom"
                                                unCheckedChildren="Default"
                                                checked={checkedVariant}
                                                onChange={(e) => handleChangeCustomVariant(e)}
                                            />
                                        }
                                    />
                                    <CardContent>
                                        {checkedVariant ? (
                                            <Grid container justify="center">
                                                Using custom variant
                                            </Grid>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item lg={4} sm={12}>
                                <Card>
                                    <CardHeader title="Sale channels and apps" />
                                    <CardContent>
                                        <Checkbox.Group
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                            className="sale-channel-checkbox"
                                            options={saleChannel}
                                            defaultValue={["Apple"]}
                                            onChange={(e) =>
                                                setState({
                                                    ...state,
                                                    saleChannel: e,
                                                })
                                            }
                                        />
                                    </CardContent>
                                </Card>
                                <Card className="mt-3">
                                    <CardHeader title="Carrier" />
                                    <CardContent>
                                        <Grid container alignItems="center" justify="space-between">
                                            <RadioGroup
                                                value={state.carrierId}
                                                onChange={(e) =>
                                                    setState({
                                                        ...state,
                                                        carrierId: parseInt(e.target.value),
                                                    })
                                                }
                                                name="carrierId"
                                                row
                                            >
                                                {carrier.map((item) => (
                                                    <FormControlLabel
                                                        className="mr-3"
                                                        value={item.value}
                                                        control={<Radio />}
                                                        label={item.label}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </Grid>
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
                                                    disabled
                                                    value={state.baseCost}
                                                    variant="outlined"
                                                    validators={["required"]}
                                                    errorMessages={["this field is required"]}
                                                    size="small"
                                                    required
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">{dataUser.user_level + " ($)"}</InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextValidator
                                                    className="w-100"
                                                    onChange={handleChange}
                                                    label="Regular price"
                                                    name="regularPrice"
                                                    type="number"
                                                    value={state.regularPrice}
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
                                            <Grid item xs={6}>
                                                <TextValidator
                                                    className="w-100"
                                                    onChange={handleChange}
                                                    label="Sale price"
                                                    name="salePrice"
                                                    type="number"
                                                    value={state.salePrice}
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
                                                    disabled
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
                                                    disabled
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
                                    <CardHeader title="ASIN / SKU" />
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
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
                                                    <Button variant="outline-primary" disabled size="sm" onClick={handleAddBullet}>
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
                                <Button className="mr-3 mb-0" size="sm" variant="secondary" onClick={() => updateTable()}>
                                    <CloseIcon />
                                    Cancel
                                </Button>
                                <Button
                                    className=" mb-0"
                                    variant="primary"
                                    size="sm"
                                    type="submit"
                                    disabled={
                                        !state.des |
                                        !state.regularPrice |
                                        !state.salePrice |
                                        (state.saleChannel.length === 0) |
                                        (state.image.length === 0) |
                                        (printFile.find((el) => !el.media) !== undefined) |
                                        (variant.length === 0) |
                                        (variant.find((el) => !el.regularPrice | !el.image | !el.data | !el.salePrice) !== undefined)
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
            )}
        </>
    );
};

export default ProductAddNew;

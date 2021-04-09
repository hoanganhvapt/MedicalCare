import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { getListCategory } from "./ProductService";
import { toast } from "react-toastify";
import { Grid } from "@material-ui/core";
import { Button } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import DialogAddNew from "./DialogAddNew";
import DialogConfirm from "./DialogConfirm";

toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
    position: "top-center",
});
const Category = (props) => {
    const [data, setData] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState(null);
    const [dataDelete, setDataDelete] = useState(null);

    const columns = [
        {
            title: "Category Name",
            field: "label",
            align: "center",
            headerStyle: {
                // pointerEvents: "none",
            },
            cellStyle: {
                fontWeight: 600,
                color: "#f95d01",
            },
        },
        {
            title: "Type",
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

    const handleOpenDialogAdd = () => {
        setOpenAdd(true);
    };

    const handleOpenDialogEdit = (id) => {
        setOpenEdit(true);
        setId(id);
    };

    const handleOpenDialogDelete = (data) => {
        setOpenDelete(true);
        setDataDelete(data);
    };

    const handleCloseDialog = () => {
        setOpenAdd(false);
        setOpenEdit(false);
        setOpenDelete(false);
    };

    const updateData = () => {
        getListCategory()
            .then((res) => {
                let result = res.data.data;
                setData(result);
            })
            .catch((err) => toast.error(err));
        setOpenAdd(false);
        setOpenEdit(false);
        setOpenDelete(false);
    };

    useEffect(() => {
        updateData();
    }, []);
    return (
        <>
            <Grid container className="pb-2">
                <Button className="mr-3" size="sm" variant="primary" onClick={handleOpenDialogAdd}>
                    <AddIcon />
                    New Category
                </Button>
            </Grid>
            {openAdd && (
                <DialogAddNew close={() => handleCloseDialog("category")} open={openAdd} type="category" update={() => updateData()} />
            )}
            {openEdit && (
                <DialogAddNew
                    close={() => handleCloseDialog("category")}
                    id={id}
                    open={openEdit}
                    type="category"
                    update={() => updateData()}
                />
            )}
            {openDelete && (
                <DialogConfirm
                    close={() => handleCloseDialog("category")}
                    data={dataDelete}
                    open={openDelete}
                    type="category"
                    update={() => updateData()}
                />
            )}
            <MaterialTable
                title=""
                columns={columns}
                data={data}
                actions={[
                    {
                        tooltip: "Edit",
                        icon: "edit",
                        onClick: (evt, data) => handleOpenDialogEdit(data.id),
                    },
                    {
                        tooltip: "Delete",
                        icon: "delete",
                        onClick: (evt, data) => handleOpenDialogDelete(data),
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
                        zIndex: 9,
                    },
                    // sorting: false,
                    selection: false,
                    paging: false,
                }}
            />
        </>
    );
};

export default Category;

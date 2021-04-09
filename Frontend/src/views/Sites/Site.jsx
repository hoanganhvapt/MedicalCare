import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import { Grid, Tooltip } from "@material-ui/core";
import { getListSiteByUserId } from "./SiteService";
import { useSelector } from "react-redux";
import DialogSiteAddNew from "./DialogSiteAddNew";
import DialogSiteDelete from "./DialogSiteDelete";
import DialogInstallApp from "./DialogInstallApp";

toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const Site = (props) => {
    const dataUser = useSelector((state) => state.user.dataUser);
    const userId = dataUser[0].id;
    const [openHowTo, setOpenHowTo] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [dataDelete, setDataDelete] = useState(null);
    const [data, setData] = useState([]);
    const [id, setId] = useState(null);

    const columns = [
        {
            title: "Site Name",
            field: "store_name",
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
            title: "Platform",
            field: "store_type",
            align: "center",
            headerStyle: {
                pointerEvents: "none",
            },
        },
        {
            title: "Date Enetered",
            field: "dtime_entered",
            align: "center",
            headerStyle: {
                pointerEvents: "none",
            },
        },
    ];

    const handleOpenDialogEdit = (id) => {
        setOpenEdit(true);
        setId(id);
    };

    const handleOpenDialogDelete = (data) => {
        setOpenDelete(true);
        setDataDelete(data);
    };

    const handleCloseDialog = () => {
        setOpenHowTo(false);
        setOpenAdd(false);
        setOpenEdit(false);
        setOpenDelete(false);
    };

    const handleOpenDialogHowTo = () => {
        setOpenHowTo(true);
    };

    const handleOpenDialogAdd = () => {
        setOpenAdd(true);
    };

    const updateData = () => {
        getListSiteByUserId({ user_id: userId })
            .then((res) => {
                let result = res.data.data;
                setData(result);
            })
            .catch((err) => toast.error(err));
        setOpenHowTo(false);
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
                <Button
                    className="mr-3"
                    size="sm"
                    variant="primary"
                    onClick={handleOpenDialogAdd}
                >
                    <AddIcon />
                    New Site
                </Button>
                <Button variant="" size="sm" onClick={handleOpenDialogHowTo}>
                    How To Install Private App
                </Button>
                {openHowTo && (
                    <DialogInstallApp
                        close={() => handleCloseDialog("app")}
                        open={openHowTo}
                        type="site"
                        update={() => updateData()}
                    />
                )}
            </Grid>

            {openAdd && (
                <DialogSiteAddNew
                    close={() => handleCloseDialog("site")}
                    open={openAdd}
                    type="site"
                    update={() => updateData()}
                />
            )}
            {openEdit && (
                <DialogSiteAddNew
                    close={() => handleCloseDialog("site")}
                    id={id}
                    open={openEdit}
                    type="site"
                    update={() => updateData()}
                />
            )}
            {openDelete && (
                <DialogSiteDelete
                    close={() => handleCloseDialog("site")}
                    data={dataDelete}
                    open={openDelete}
                    type="site"
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
                        onClick: (evt, data) => {
                            handleOpenDialogEdit(data.id);
                        },
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
                    },
                    sorting: false,
                    selection: false,
                    paging: false,
                }}
            />
        </>
    );
};

export default Site;

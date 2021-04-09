import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { toast } from "react-toastify";
import { getSites } from "./SiteService";
import { getSellerName } from "../User/UserService";

toast.configure({
    limit: 3,
    autoClose: 4000,
    closeOnClick: true,
    hideProgressBar: false,
    draggable: false,
});

const ListSites = (props) => {
    const test = [];
    const [data, setData] = useState([]);

    const columns = [
        {
            title: "Site ID",
            field: "id",
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
            title: "Seller",
            field: "user_id",
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
            title: "Date Enetered",
            field: "dtime_entered",
            align: "center",
            headerStyle: {
                pointerEvents: "none",
            },
        },
    ];

    const updateData = () => {
        getSites().then((res) => {
            let result = res.data.data;
            setData(result);
        });
        // getSites()
        //     .then((res) => {
        //         let site = res.data.data;
        //         for (let i = 0; i < site.length; i++) {
        //             let seller_id = site[i].user_id;
        //             getSellerName({ id: seller_id })
        //                 .then((res) => {
        //                     let seller_name = res.data.data;
        //                     for (let j = 0; j < seller_name.length; j++) {
        //                         let result = {
        //                             id: site[i].id,
        //                             store_name: site[i].store_name,
        //                             seller_name: seller_name[j].seller_name,
        //                             dtime_entered: site[i].dtime_entered,
        //                         };
        //                         console.log(result);
        //                         test.push(result);
        //                     }
        //                 })
        //                 .catch((err) => toast.error(err));
        //         }
        //     })
        //     .catch((err) => toast.error(err));
        // setData(test);
    };

    useEffect(() => {
        updateData();
    }, []);

    return (
        <>
            <MaterialTable
                title=""
                columns={columns}
                data={data}
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

export default ListSites;

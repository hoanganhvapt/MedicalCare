import { lazy } from "react";

const DashboardDefault = lazy(() => import("./views/Dashboard/Default"));

const routes = [
    {
        path: "/",
        exact: true,
        name: "Dashboard",
        component: DashboardDefault,
        // role: [2, 3, 6],
    },
];

export default routes;

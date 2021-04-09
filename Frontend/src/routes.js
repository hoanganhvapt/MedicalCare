import { lazy } from "react";

const DashboardDefault = lazy(() => import("./views/Dashboard/Default"));
const Product = lazy(() => import("./views/products/Product"));
const ProductType = lazy(() => import("./views/products/ProductType"));
const ProductTypeAddNew = lazy(() =>
    import("./views/products/ProductTypeAddNew")
);
const Order = lazy(() => import("./views/orders/Order"));
const OrderDetail = lazy(() => import("./views/orders/OrderDetail"));
const Category = lazy(() => import("./views/products/Category"));
const OutstandingInvoices = lazy(() =>
    import("./views/payment/OustandingInvoices")
);
const PaymentMethod = lazy(() => import("./views/payment/PaymentMethod"));
const TransactionHistory = lazy(() =>
    import("./views/payment/TransactionHistory")
);
const InvoiceDetail = lazy(() => import("./views/payment/InvoiceDetail"));
const Carrier = lazy(() => import("./views/products/Carrier"));
const Dashboard = lazy(() => import("./views/Charts/Nvd3Chart/index"));
const newDashboard = lazy(() => import("./views/Charts/dashboard/NewIndex"));
const Site = lazy(() => import("./views/Sites/Site"));
const ListSites = lazy(() => import("./views/Sites/ListSites"));

const routes = [
    {
        path: "/products/product",
        exact: true,
        name: "Product Management",
        component: Product,
        role: [2, 3, 6],
    },
    {
        path: "/products/product-type",
        exact: true,
        name: "Product Type",
        component: ProductType,
        role: [2, 3, 6],
    },
    {
        path: "/products/product-type/new",
        exact: true,
        name: "Add Product Type",
        component: ProductTypeAddNew,
        role: [2, 3],
    },
    {
        path: "/orders",
        exact: true,
        name: "Orders",
        component: Order,
        role: [2, 3, 6, 7, 10],
    },
    {
        path: "/orders/:order_number",
        exact: true,
        name: "Order Detail",
        component: OrderDetail,
        role: [2, 3, 6, 7, 10],
    },
    {
        path: "/products/category",
        exact: true,
        name: "Category",
        component: Category,
        role: [2, 3],
    },
    {
        path: "/products/carrier",
        exact: true,
        name: "Carrier",
        component: Carrier,
        role: [2, 3],
    },
    {
        path: "/billing/outstanding-invoices",
        exact: true,
        name: "OutStanding Invoices",
        component: OutstandingInvoices,
        role: [2, 3, 6, 7],
    },
    {
        path: "/billing/payment-methods",
        exact: true,
        name: "Payment Method",
        component: PaymentMethod,
        role: [2, 3, 6],
    },
    {
        path: "/billing/payment-methods/:status",
        name: "Payment Method",
        component: PaymentMethod,
        role: [2, 3, 6],
    },
    {
        path: "/billing/transaction-history",
        exact: true,
        name: "Transaction History",
        component: TransactionHistory,
        role: [2, 3, 6],
    },
    {
        path: "/billing/:order_number",
        exact: true,
        name: "Invoice Detail",
        component: InvoiceDetail,
        role: [2, 3, 6],
    },
    {
        path: "/",
        exact: true,
        name: "Dashboard",
        component: DashboardDefault,
        role: [2, 3, 6],
    },
    {
        path: "/sites/site",
        exact: true,
        name: "SiteManagement",
        component: Site,
        role: [6],
    },
    {
        path: "/sites/list-sites",
        exact: true,
        name: "ListSites",
        component: ListSites,
        role: [2],
    },
];

export default routes;

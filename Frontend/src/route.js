import React from "react";

// const SignUp1 = React.lazy(() =>
//     import("./views/Authentication/SignUp/SignUp1")
// );
const SignIn = React.lazy(() => import("./views/Authentication/SignIn/SignIn"));

const route = [
    // { path: "/auth/signup", exact: true, name: "Signup 1", component: SignUp1 },
    { path: "/auth/signin", exact: true, name: "Signin 1", component: SignIn },
];

export default route;

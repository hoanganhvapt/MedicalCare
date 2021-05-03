import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App/index";
import App1 from "./App/displayStep";
import * as serviceWorker from "./serviceWorker";
import { Config } from "./config";
import store from "./store";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css";
import "../src/assets/scss/style.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(fab, fas, far);

ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter basename={Config.basename}>
                <App />
            </BrowserRouter>
        </Provider>
    ,
    document.getElementById("root")
);

serviceWorker.unregister();

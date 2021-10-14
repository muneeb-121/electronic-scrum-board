import { Fragment } from "react";
import ReactDOM from "react-dom";
import "./style.css"
import 'antd/dist/antd.css';

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <Fragment>
        <App />
    </Fragment>,
    rootElement
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route } from "react-router-dom";

import "assets/scss/black-dashboard-react.scss";
// import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/css/style.css";

import App from "app";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Route render={(props) => <App {...props} />} />
  </BrowserRouter>
);

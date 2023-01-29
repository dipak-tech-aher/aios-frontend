import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from "./AppContext";
import App from "./App";
import './assets/css/bootstrap-creative.min.css';
import './assets/css/app-creative.css';
import './assets/css/icons.min.css';
import './index.css';
import Spinner from "./common/spinner";
import "./i18next";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Theme from '../src/common/Theme.jsx';
toast.configure();


ReactDOM.render(
  <AppProvider>
    <Theme>
      <App />
      <Spinner />
    </Theme>
  </AppProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HelmetProvider } from "react-helmet-async";
import { ConfigProvider } from "antd";
import theme from "./theme";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "./components/common/Toaster";
import setupAxiosInterceptors from "./config/axios-interceptor";

setupAxiosInterceptors(() => {});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ConfigProvider theme={theme}>
    <HelmetProvider>
      <React.StrictMode>
        <Provider store={store}>
          <Toaster />
          <App />
        </Provider>
      </React.StrictMode>
    </HelmetProvider>
  </ConfigProvider>
);

reportWebVitals();

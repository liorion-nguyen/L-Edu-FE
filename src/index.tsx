import { ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import App from "./App";
import { Toaster } from "./components/common/Toaster";
import setupAxiosInterceptors from "./config/axios-interceptor";
import "./index.css";
import "./styles/modal-fix.css";
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import getAntdTheme from "./theme";

setupAxiosInterceptors(() => {});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ConfigProvider theme={getAntdTheme()}>
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

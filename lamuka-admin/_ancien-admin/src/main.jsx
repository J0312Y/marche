import React from "react";
import ReactDOM from "react-dom/client";
import { I18nProvider } from "./i18n";
import { ToastProvider } from "./components/UI";
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <I18nProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </I18nProvider>
);

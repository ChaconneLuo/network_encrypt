import React from "react";
import ReactDOM from "react-dom/client";
import { Watermark } from 'antd';
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Watermark content="Pang Lifan" zIndex={10000} font={{ color: '#BBC7D7' }}>
      <App />
    </Watermark>
  </React.StrictMode>
);

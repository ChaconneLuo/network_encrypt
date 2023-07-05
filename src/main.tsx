import React from "react";
import ReactDOM from "react-dom/client";
import { Watermark } from 'antd';
import "./styles.css";
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './router';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Watermark content="Pang Lifan" font={{ color: '#BBC7D7' }}>
      <Router>
        <BaseRouter />
      </Router>
    </Watermark>
  </React.StrictMode>
);

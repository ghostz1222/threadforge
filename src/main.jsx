import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThreadForgeProvider } from "./context/ThreadForgeContext";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThreadForgeProvider>
        <App />
      </ThreadForgeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

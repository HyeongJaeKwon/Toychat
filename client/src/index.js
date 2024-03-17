import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ListContextProvider } from "./context/ListContext";
import { CallContextProvider } from "./context/CallContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CallContextProvider>
    <ListContextProvider>
      <App />
    </ListContextProvider>
  </CallContextProvider>
);

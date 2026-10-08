import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "sweetalert2/dist/sweetalert2.min.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StudentProvider } from "./context/StudentContext";

import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/globals.css";

import App from "./App/App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StudentProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </StudentProvider>
  </StrictMode>
);
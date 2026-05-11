import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/**
 * ArcGIS core CSS — using the LIGHT theme for a professional,
 * industry-standard appearance (matches ArcGIS Online, Portal).
 */
import "@arcgis/core/assets/esri/themes/light/main.css";

import App from "./App.jsx";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

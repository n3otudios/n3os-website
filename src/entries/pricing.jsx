import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import Pricing from "../pages/Pricing.jsx";
import "../styles/main.css";

hydrateRoot(document.getElementById("root"),
  <StrictMode>
    <Pricing />
  </StrictMode>
);

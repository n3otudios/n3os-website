import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import About from "../pages/About.jsx";
import "../styles/main.css";

hydrateRoot(document.getElementById("root"),
  <StrictMode>
    <About />
  </StrictMode>
);

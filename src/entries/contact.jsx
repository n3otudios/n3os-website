import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import Contact from "../pages/Contact.jsx";
import "../styles/main.css";

hydrateRoot(document.getElementById("root"),
  <StrictMode>
    <Contact />
  </StrictMode>
);

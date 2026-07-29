import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import NotFound from "../pages/NotFound.jsx";
import "../styles/main.css";

hydrateRoot(document.getElementById("root"),
  <StrictMode>
    <NotFound />
  </StrictMode>
);

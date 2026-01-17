import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./router";
import { FirebaseProvider } from "./context/firebaseContext.jsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FirebaseProvider>
      <RouterProvider router={router} />
    </FirebaseProvider>
  </StrictMode>
);

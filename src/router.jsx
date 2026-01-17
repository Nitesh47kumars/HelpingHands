import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GeneralChat from "./pages/GeneralChat"
import PrivateChat from "./pages/PrivateChat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement:"",
    children: [
      { index: true, element: <Landing /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      
      {
        element: <ProtectedLayout />,
        children:[
          { path: "dashboard", element: <Dashboard /> },
          { path: "general", element: <GeneralChat /> },
          { path: "private", element: <PrivateChat /> },
        ]
      },
    ],
  },
]);

export default router;

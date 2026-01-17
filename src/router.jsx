import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateChat from "./pages/PrivateChat";
import {HelpFeed} from "./pages/HelpFeed/HelpFeed";
import Settings from "./pages/Setting";

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
          { path: "helpfeed", element: <HelpFeed /> },
          { path: "private", element: <PrivateChat /> },
          { path: "settings", element: <Settings /> },
        ]
      },
    ],
  },
]);

export default router;

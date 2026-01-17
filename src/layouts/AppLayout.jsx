import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;

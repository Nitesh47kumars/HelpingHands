import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-zinc-950">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* This container holds Sidebar + Main Content side-by-side */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar: Fixed width, hidden on very small screens if desired */}
        <div className="hidden md:block w-64 shrink-0 border-r border-gray-200 dark:border-zinc-800">
          <Sidebar />
        </div>

        {/* Main Content Area: Scrolls independently */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default AppLayout;
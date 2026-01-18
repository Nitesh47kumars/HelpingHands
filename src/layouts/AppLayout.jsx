import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { useFirebase } from "../context/firebaseContext";
import Loading from "../Components/Loading"
const AppLayout = () => {
  const { user, loading } = useFirebase(); 
  
  const isLoggedIn = !!user;

  if (loading) {
    return <Loading/>
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {isLoggedIn && (
          <div className="hidden md:block w-64 shrink-0 border-r border-zinc-800">
            <Sidebar />
          </div>
        )}

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
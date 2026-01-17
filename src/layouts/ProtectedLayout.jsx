import { Outlet, Navigate } from "react-router-dom";
import { useFirebase } from "../context/firebaseContext";

const ProtectedLayout = () => {
  const { user, loading } = useFirebase();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;

import { Outlet, Navigate } from "react-router-dom";
import { useFirebase } from "../context/firebaseContext";

const ProtectedLayout = () => {
  const { user, loading } = useFirebase();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedLayout;

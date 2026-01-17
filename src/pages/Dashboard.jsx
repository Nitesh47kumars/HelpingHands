import { useFirebase } from "../context/firebaseContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <p className="mb-4">
        Welcome, <span className="font-semibold">{user?.email}</span>
      </p>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

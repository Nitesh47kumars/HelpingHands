import { Link, NavLink, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebaseContext";

const Navbar = () => {
  const { user, logout } = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">
          HelpingHands
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "font-medium text-blue-600" : "text-gray-600"
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/request"
                className={({ isActive }) =>
                  isActive ? "font-medium text-blue-600" : "text-gray-600"
                }
              >
                Request Help
              </NavLink>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "font-medium text-blue-600" : "text-gray-600"
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

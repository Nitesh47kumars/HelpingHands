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
    <nav className="w-full border-b bg-white border-gray-200 dark:bg-zinc-950 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Helping<span className="text-blue-600">Hands</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <NavLink
                to="/request"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                  }`
                }
              >
                Request Help
              </NavLink>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600/10 dark:text-red-500 dark:hover:bg-red-600/20 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-600 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm shadow-blue-500/20"
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
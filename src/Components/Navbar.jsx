import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useFirebase } from "../context/firebaseContext";
import { MdDashboard, MdChat, MdSettings, MdMenu, MdClose } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <MdDashboard size={20} /> },
    { id: 'helpfeed', label: 'Help Feed', path: '/helpfeed', icon: <MdChat size={20} /> },
    { id: 'chats', label: 'Chats', path: '/chats', icon: <FaUserFriends size={20} /> },
    { id: 'settings', label: 'Settings', path: '/settings', icon: <MdSettings size={20} /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full border-b bg-white border-gray-200 dark:bg-zinc-950 dark:border-zinc-800 sticky top-0 z-50">
        <div className="mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl sm:text-2xl md:text-3xl uppercase font-bold tracking-tight text-gray-900 dark:text-white">
            Helping<span className="text-blue-600">Hands</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            {user ? (
              <>
                {/* Mobile Menu Button - Only show for authenticated users */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-4">
                  <button
                    onClick={handleLogout}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 dark:bg-red-600/10 dark:text-red-500 dark:hover:bg-red-600/20 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-xs sm:text-sm font-medium transition-colors ${
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
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm shadow-blue-500/20"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && user && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 top-14"
        />
      )}

      {user && (
        <div
          className={`
            lg:hidden fixed top-14 left-0 w-64 h-[calc(100vh-57px)] bg-zinc-950 border-r border-zinc-800 z-40
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="flex flex-col h-full p-4">
            <div className="flex-1 space-y-2 pt-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm
                      ${isActive 
                        ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' 
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}
                    `}
                  >
                    <span className={isActive ? 'text-blue-500' : ''}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Logout Button */}
            <div className="pt-4 border-t border-zinc-800">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 text-red-400 hover:text-red-300 hover:bg-zinc-900 rounded-lg transition-all text-sm font-medium"
              >
                <MdClose size={18} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
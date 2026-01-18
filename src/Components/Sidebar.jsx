import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard, MdChat, MdSettings, MdMenu, MdClose } from 'react-icons/md';
import { FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import { useFirebase } from '../context/firebaseContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <MdDashboard size={20} className="sm:w-6 sm:h-6" /> },
    { id: 'helpfeed', label: 'Help Feed', path: '/helpfeed', icon: <MdChat size={20} className="sm:w-6 sm:h-6" /> },
    { id: 'chats', label: 'Chats', path: '/chats', icon: <FaUserFriends size={20} className="sm:w-6 sm:h-6" /> },
    { id: 'settings', label: 'Settings', path: '/settings', icon: <MdSettings size={20} className="sm:w-6 sm:h-6" /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white"
      >
        {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative
        flex flex-col w-64 h-full bg-zinc-950 border-r border-zinc-800 p-4 mt-2
        transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <nav className="flex-1 space-y-2 mt-12 lg:mt-0">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 sm:gap-4 px-3 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base
                  ${isActive 
                    ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' 
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}
                `}
              >
                <span className={isActive ? 'text-red-500' : ''}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 sm:gap-4 w-full px-3 py-2.5 sm:py-3 text-zinc-500 hover:text-red-400 transition-colors text-sm sm:text-base"
          >
            <FaSignOutAlt size={18} className="sm:w-5 sm:h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
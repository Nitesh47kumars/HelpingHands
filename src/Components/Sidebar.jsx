import React, { useState } from 'react';
// Importing specific icons from Material Design and Font Awesome sets
import { MdDashboard, MdChat, MdSettings, MdVideoLibrary } from 'react-icons/md';
import { FaUserFriends, FaYoutube, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard size={24} /> },
    { id: 'general', label: 'General Chat', icon: <MdChat size={24} /> },
    { id: 'private', label: 'Private Chats', icon: <FaUserFriends size={24} /> },
    { id: 'settings', label: 'Settings', icon: <MdSettings size={24} /> },
  ];

  return (
    <aside className="flex flex-col w-64 h-screen bg-zinc-950 border-r border-zinc-800 p-4">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 px-3 mb-10 text-red-600">
        <FaYoutube size={30} />
        <span className="text-xl font-bold tracking-tighter text-white">MyTube</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all
              ${activeTab === item.id 
                ? 'bg-zinc-800 text-white shadow-lg' 
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}
            `}
          >
            <span className={activeTab === item.id ? 'text-red-500' : ''}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-zinc-800">
        <button className="flex items-center gap-4 w-full px-3 py-3 text-zinc-500 hover:text-red-400 transition-colors">
          <FaSignOutAlt size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFirebase } from "../../context/firebaseContext";
import { getDatabase, ref, onValue } from "firebase/database";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const db = getDatabase();

const Chats = () => {
  const { user } = useFirebase();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, "users");
    return onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const otherUsers = Object.values(data).filter(
          (u) => u.uid !== user?.uid
        );
        setUsers(otherUsers);
      }
    });
  }, [user]);

  useEffect(() => {
    if (location.state?.recipient) {
      setSelectedUser(location.state.recipient);
      // On mobile, hide sidebar when user is selected
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    }
  }, [location.state]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Hide sidebar on mobile when user is selected
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };

  const handleBackToList = () => {
    setShowSidebar(true);
    // Optionally clear selected user on mobile
    if (window.innerWidth < 768) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] md:h-[85vh] mx-auto bg-zinc-900 rounded-xl md:rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
      {/* Sidebar - Hidden on mobile when chat is open */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-1/3`}>
        <ChatSidebar
          users={users}
          selectedUser={selectedUser}
          onSelect={handleSelectUser}
          currentUserId={user?.uid}
        />
      </div>

      {/* Chat Window - Hidden on mobile when sidebar is open */}
      <div className={`${!showSidebar || selectedUser ? 'flex' : 'hidden'} md:flex flex-1`}>
        <ChatWindow 
          selectedUser={selectedUser} 
          currentUser={user}
          onBack={handleBackToList}
        />
      </div>
    </div>
  );
};

export default Chats;
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFirebase } from "../context/firebaseContext";
import { getDatabase, ref, onValue } from "firebase/database";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

const db = getDatabase();

const Chats = () => {
  const { user } = useFirebase();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
    }
  }, [location.state]);

  return (
    <div className="flex h-[85vh] max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden mt-4">
      <ChatSidebar
        users={users}
        selectedUser={selectedUser}
        onSelect={setSelectedUser}
      />
      <ChatWindow selectedUser={selectedUser} currentUser={user} />
    </div>
  );
};

export default Chats;

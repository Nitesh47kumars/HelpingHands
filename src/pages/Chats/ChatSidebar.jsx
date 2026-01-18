import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";

const db = getDatabase();

const ChatSidebar = ({ users, selectedUser, onSelect, currentUserId }) => {
  const [activeChatIds, setActiveChatIds] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;

    const chatsRef = ref(db, "chats");
    return onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const activeUsers = Object.keys(data)
          .filter((roomId) => roomId.includes(currentUserId))
          .map((roomId) => roomId.replace(currentUserId, "").replace("_", ""));
        setActiveChatIds(activeUsers);
      }
    });
  }, [currentUserId]);

  return (
    <div className="w-full border-r border-zinc-800 flex flex-col bg-zinc-900/50">
      <div className="p-3 sm:p-4 border-b border-zinc-800 font-bold text-white flex items-center gap-2 text-sm sm:text-base">
        <FaUserFriends className="text-blue-500" size={20} />
        <span>Messages</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.length > 0 ? (
          users.map((u) => (
            <button
              key={u.uid}
              onClick={() => onSelect(u)}
              className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 transition-colors ${
                selectedUser?.uid === u.uid
                  ? "bg-blue-900/20 border-r-4 border-blue-500"
                  : "hover:bg-zinc-800"
              }`}
            >
              <FaUserCircle 
                size={32} 
                className="text-zinc-400 shrink-0 sm:w-9 sm:h-9" 
              />
              <div className="text-left overflow-hidden flex-1 min-w-0">
                <p className="font-semibold text-zinc-200 truncate text-sm sm:text-base">
                  {u.fullName}
                </p>
                <p className="text-[10px] sm:text-xs text-zinc-500 truncate">
                  {activeChatIds.includes(u.uid)
                    ? "Active conversation"
                    : "New message"}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="p-6 sm:p-8 text-center text-zinc-500 text-xs sm:text-sm">
            <p>No active chats yet.</p>
            <p className="text-[10px] mt-2">
              Messages from "Offer Help" will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
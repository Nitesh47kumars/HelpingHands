import React from "react";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";

const ChatSidebar = ({ users, selectedUser, onSelect }) => (
  <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50">
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-800 dark:text-white flex items-center gap-2">
      <FaUserFriends className="text-blue-500" /> Messages
    </div>
    <div className="flex-1 overflow-y-auto">
      {users.length > 0 ? (
        users.map((u) => (
          <button
            key={u.uid}
            onClick={() => onSelect(u)}
            className={`w-full flex items-center gap-3 p-4 transition-colors ${
              selectedUser?.uid === u.uid
                ? "bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <FaUserCircle size={36} className="text-zinc-400 shrink-0" />
            <div className="text-left overflow-hidden">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                {u.fullName}
              </p>
              <p className="text-[10px] text-zinc-500 truncate italic">
                {activeChatIds.includes(u.uid)
                  ? "Active conversation"
                  : "New message"}
              </p>
            </div>
          </button>
        ))
      ) : (
        <div className="p-8 text-center text-zinc-500 text-sm">
          <p>No active chats yet.</p>
          <p className="text-[10px] mt-2">
            Messages from "Offer Help" will appear here.
          </p>
        </div>
      )}
    </div>
  </div>
);

export default ChatSidebar;

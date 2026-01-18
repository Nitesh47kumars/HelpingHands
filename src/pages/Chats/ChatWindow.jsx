import React, { useState, useEffect, useRef } from "react";
import {
  getDatabase,
  ref,
  push,
  onValue,
  serverTimestamp,
} from "firebase/database";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";
import MessageInput from "./MessageInput";

const db = getDatabase();

const ChatWindow = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  const getRoomId = (uid1, uid2) =>
    uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

  useEffect(() => {
    if (!selectedUser || !currentUser) return;
    const roomId = getRoomId(currentUser.uid, selectedUser.uid);
    const chatRef = ref(db, `chats/${roomId}`);

    return onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(
        data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []
      );
    });
  }, [selectedUser, currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const roomId = getRoomId(currentUser.uid, selectedUser.uid);
    await push(ref(db, `chats/${roomId}`), {
      text,
      senderId: currentUser.uid,
      timestamp: serverTimestamp(),
    });
  };

  if (!selectedUser) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/30 dark:bg-zinc-900/30">
        <FaUserCircle size={30} className="text-zinc-400" />
        <span className="font-bold text-zinc-800 dark:text-white">
          {selectedUser.fullName}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUser.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm ${
                msg.senderId === currentUser.uid
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <MessageInput
        onSend={sendMessage}
        placeholderName={selectedUser.fullName}
      />
    </div>
  );
};

const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
      <FaUserFriends size={40} className="opacity-20" />
    </div>
    <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
      Your Inbox
    </h3>
    <p className="max-w-xs text-sm">Select a person to start chatting.</p>
  </div>
);

export default ChatWindow;

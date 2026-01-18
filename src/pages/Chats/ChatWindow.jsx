import React, { useState, useEffect, useRef } from "react";
import {
  getDatabase,
  ref,
  push,
  onValue,
  serverTimestamp,
} from "firebase/database";
import { FaUserCircle, FaUserFriends, FaArrowLeft } from "react-icons/fa";
import MessageInput from "./MessageInput";
import MiniHelpCard from "./MiniHelpCard";

const db = getDatabase();

const ChatWindow = ({ selectedUser, currentUser, onBack }) => {
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
    <div className="flex-1 flex flex-col bg-zinc-900 w-full">
      <div className="p-3 sm:p-4 border-b border-zinc-800 flex items-center gap-2 sm:gap-3 bg-zinc-900/30">
        <button
          onClick={onBack}
          className="md:hidden p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <FaArrowLeft size={18} className="text-zinc-400" />
        </button>

        <FaUserCircle size={28} className="text-zinc-400 sm:w-7.5 sm:h-7.5" />
        <span className="font-bold text-white text-sm sm:text-base truncate">
          {selectedUser.fullName}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.senderId === currentUser.uid ? "items-end" : "items-start"
            }`}
          >
            {msg.cardData && (
              <div
                className={`mb-2 ${
                  msg.senderId === currentUser.uid ? "mr-0" : "ml-0"
                }`}
              >
                <MiniHelpCard cardData={msg.cardData} />
              </div>
            )}

            <div
              className={`px-3 sm:px-4 py-2 rounded-2xl max-w-[85%] sm:max-w-[75%] text-xs sm:text-sm shadow-sm ${
                msg.senderId === currentUser.uid
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-zinc-800 text-zinc-200 rounded-tl-none"
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
  <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-6 sm:p-8 text-center">
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
      <FaUserFriends size={32} className="opacity-20 sm:w-10 sm:h-10" />
    </div>
    <h3 className="text-base sm:text-lg font-bold text-zinc-300">Your Inbox</h3>
    <p className="max-w-xs text-xs sm:text-sm mt-2">
      Select a person to start chatting.
    </p>
  </div>
);

export default ChatWindow;

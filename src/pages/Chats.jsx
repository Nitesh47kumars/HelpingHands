import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // IMPORTANT
import { useFirebase } from "../context/firebaseContext";
import {
  getDatabase,
  ref,
  push,
  onValue,
  serverTimestamp,
} from "firebase/database";
import { MdSend } from "react-icons/md";
import { FaUserCircle, FaUserFriends } from "react-icons/fa";

const db = getDatabase();

const Chats = () => {
  const { user } = useFirebase();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
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

  const getRoomId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  };

  useEffect(() => {
    if (!selectedUser || !user) return;

    const roomId = getRoomId(user.uid, selectedUser.uid);
    const chatRef = ref(db, `chats/${roomId}`);

    return onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(
          Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        );
      } else {
        setMessages([]);
      }
    });
  }, [selectedUser, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const roomId = getRoomId(user.uid, selectedUser.uid);
    const chatRef = ref(db, `chats/${roomId}`);

    await push(chatRef, {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="flex h-[85vh] max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden mt-4">
      <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-800 dark:text-white flex items-center gap-2">
          <FaUserFriends className="text-blue-500" /> Messages
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <button
              key={u.uid}
              onClick={() => setSelectedUser(u)}
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
                <p className="text-[10px] text-zinc-500 truncate">
                  Click to message
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/30 dark:bg-zinc-900/30">
              <FaUserCircle size={30} className="text-zinc-400" />
              <span className="font-bold text-zinc-800 dark:text-white">
                {selectedUser.fullName}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:opacity-90">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === user.uid ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-sm ${
                      msg.senderId === user.uid
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-zinc-50 dark:bg-zinc-900/80 border-t border-zinc-200 dark:border-zinc-800 flex gap-2"
            >
              <input
                autoFocus
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Type a message to ${selectedUser.fullName}...`}
                className="flex-1 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 ring-blue-500/50 transition-all"
              />
              <button className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-90 transition-transform">
                <MdSend size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <FaUserFriends size={40} className="opacity-20" />
            </div>
            <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
              Your Inbox
            </h3>
            <p className="max-w-xs text-sm">
              Select a person from the left to start a conversation or offer
              help on the feed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
